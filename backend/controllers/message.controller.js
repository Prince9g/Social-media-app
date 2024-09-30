//for chatting
import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, recieverId]}
        });
        //establish the conversation if not started yet.

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, recieverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);
        //for saving all schema frequently
        await Promise.all([conversation.save(), newMessage.save()]);

        //implement socket io for real time data transfer


        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const conversation = await Conversation.find({
            participants:{$all:[senderId, recieverId]}
        })
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
    } catch (error) {
        console.log(error);
    }
}