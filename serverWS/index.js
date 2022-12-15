const ws = require('ws');
const amqp = require('amqplib');

const queue = 'theme';

const wss = new ws.Server({
    port: 5000,
},()=>console.log('server started on 5000'))

wss.on('connection',function connection(ws) {
    ws.on('message',function (message) {
        message = JSON.parse(message);
        switch (message.event) {
            case 'message':
                sendMessage(message);
                break;
            case 'connection':
                sendMessage(message);
                break;
            case 'new_theme':
                newTheme(message);
                break;
            case 'get_theme':
                getTheme(message);
                break;
        }
    })
})

function sendMessage(message) {
    wss.clients.forEach(
        client=>{
            client.send(JSON.stringify(message));
        }
    )
}

async function newTheme(message) {
    let theme = `${message.message} [by ${message.username}]`
    const conn = await amqp.connect('amqp://user:password@localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(queue);
    ch.sendToQueue(queue,Buffer.from(theme));
    await ch.close();
    await conn.close();
}

async function getTheme(message) {
    let theme = 'Create new theme! [by server]';
    try {
        const conn = await amqp.connect('amqp://user:password@localhost');
        const ch = await conn.createChannel();
        await ch.assertQueue(queue);
        ch.consume(queue,async (msg)=>{
            theme = msg.content.toString();
            ch.ack(msg);
            await ch.close();
            await conn.close();
            message.message = theme;
            sendMessage(message);
        });
    }
    catch (e) {
        console.log(e);
    }

}