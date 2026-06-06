const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Send a message
// @route   POST /api/contact
// @access  Public
const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
    }

    try {
        const contact = await Contact.create({
            name,
            email,
            message,
        });

        // Direct email report notification
        try {
            await sendEmail({
                email: process.env.EMAIL_USER || 'phulkeshwarmahto9@gmail.com',
                subject: `💼 Portfolio Message from ${name}`,
                message: `Hello Phulkeshwar,\n\nYou have received a new contact message from your portfolio website.\n\n👤 Sender: ${name}\n✉️ Email: ${email}\n\n💬 Message:\n"${message}"\n\nBest regards,\nYour Portfolio System`,
            });
            console.log(`✅ Direct email report successfully dispatched to ${process.env.EMAIL_USER || 'phulkeshwarmahto9@gmail.com'}`);
        } catch (mailError) {
            console.error('⚠️ Email notification could not be sent. Check your EMAIL_PASS in .env:', mailError.message);
        }

        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private (Admin)
const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to a message
// @route   POST /api/contact/:id/reply
// @access  Private (Admin)
const replyMessage = async (req, res) => {
    const { subject, message } = req.body;

    if (!subject || !message) {
        res.status(400).json({ message: 'Please provide a subject and a message' });
        return;
    }

    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }

        // Dispatch email to original sender
        await sendEmail({
            email: contact.email,
            subject: subject,
            message: message,
        });

        // Save reply in the database record
        contact.replies.push({
            subject,
            message,
            sentAt: new Date()
        });
        await contact.save();

        res.status(200).json({ success: true, contact });
    } catch (error) {
        console.error('Reply dispatch error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    deleteMessage,
    replyMessage,
};
