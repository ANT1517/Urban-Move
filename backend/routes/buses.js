const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const supabase = require('../db/supabase');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { from, to, date } = req.query;
        let query = supabase.from('buses').select('*');

        if (from) query = query.ilike('from_city', `%${from}%`);
        if (to) query = query.ilike('to_city', `%${to}%`);
        if (date) query = query.eq('travel_date', date);

        const { data: buses, error } = await query;
        if (error) throw error;

        res.json({ data: buses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { data: bus, error } = await supabase
            .from('buses')
            .select('*')
            .eq('id', req.params.id)
            .maybeSingle();

        if (error || !bus) return res.status(404).json({ message: "Bus not found" });
        
        res.json({ data: bus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', verifyAdmin, async (req, res) => {
    try {
        const { name, from_city, to_city, departure_time, arrival_time, price, total_seats, amenities, travel_date } = req.body;

        const { data: newBus, error } = await supabase
            .from('buses')
            .insert([{
                name, from_city, to_city, departure_time, arrival_time,
                price: Number(price), total_seats: Number(total_seats),
                amenities: amenities || [],
                travel_date: travel_date || new Date().toISOString().split("T")[0]
            }])
            .select()
            .single();

        if (error) throw error;
        
        res.status(201).json({ data: newBus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
