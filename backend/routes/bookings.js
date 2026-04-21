const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const supabase = require('../db/supabase');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        const { bus_id, seats, passenger_name, passenger_phone, passenger_email, total_price } = req.body;
        
        const { data: bus, error: busError } = await supabase
            .from('buses')
            .select('booked_seats')
            .eq('id', bus_id)
            .maybeSingle();

        if (busError || !bus) return res.status(404).json({ message: 'Bus not found' });

        const overlap = seats.some(seat => bus.booked_seats.includes(seat));
        if (overlap) return res.status(409).json({ message: "Seats already booked. Please refresh and select again." });

        const newBookedSeats = [...bus.booked_seats, ...seats];
        const { error: updateError } = await supabase
            .from('buses')
            .update({ booked_seats: newBookedSeats })
            .eq('id', bus_id);

        if (updateError) throw updateError;

        const { data: newBooking, error: bookingError } = await supabase
            .from('bookings')
            .insert([{
                user_id: req.user.id,
                bus_id,
                seats,
                passenger_name,
                passenger_phone,
                passenger_email,
                total_price
            }])
            .select()
            .single();

        if (bookingError) throw bookingError;

        res.status(201).json({ data: newBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/mine', verifyToken, async (req, res) => {
    try {
        const { data: myBookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                bus:buses ( name, from_city, to_city, departure_time, arrival_time )
            `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data: myBookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', verifyAdmin, async (req, res) => {
    try {
        const { data: allBookings, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data: allBookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
                *,
                bus:buses ( name, from_city, to_city, departure_time, arrival_time )
            `)
            .eq('id', req.params.id)
            .maybeSingle();

        if (error || !booking) return res.status(404).json({ message: "Booking not found" });
        
        if (!req.user.is_admin && booking.user_id !== req.user.id) {
             return res.status(403).json({ message: "Unauthorized" });
        }

        res.json({ data: booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
