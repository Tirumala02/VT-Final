import cron from 'node-cron';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find orders that are delivered and older than 30 days
        const oldOrders = await orderModel.find({ deliveredAt: { $lte: thirtyDaysAgo } });

        // Delete corresponding guest users
        for (const order of oldOrders) {
            const user = await userModel.findById(order.userId);
            if (user && user.userType === "guest") {
                await userModel.findByIdAndDelete(user._id);
            }
        }

        // Delete old orders
        await orderModel.deleteMany({ deliveredAt: { $lte: thirtyDaysAgo } });

        console.log(`Deleted ${oldOrders.length} guest users and orders.`);
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
});
