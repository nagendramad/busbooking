import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(SmartTravelApp());
}

class SmartTravelApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Travel Bus Booking',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(brightness: Brightness.dark),
      themeMode: ThemeMode.system,
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _formKey = GlobalKey<FormState>();
  String source = '';
  String destination = '';
  DateTime selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Smart Travel Bus Booking')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Source'),
                onChanged: (val) => source = val,
                validator: (val) => val?.isEmpty ?? true ? 'Enter source' : null,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Destination'),
                onChanged: (val) => destination = val,
                validator: (val) => val?.isEmpty ?? true ? 'Enter destination' : null,
              ),
              ListTile(
                title: Text('Date: ${selectedDate.toLocalDateString()}'),
                trailing: Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: selectedDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(Duration(days: 60)),
                  );
                  if (picked != null) setState(() => selectedDate = picked);
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    // Search buses
                  }
                },
                child: Text('Search Buses'),
              ),
              SizedBox(height: 20),
              Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              Wrap(
                spacing: 10,
                children: [
                  Chip(label: Text('Bangalore → Mumbai')),
                  Chip(label: Text('Delhi → Jaipur')),
                  Chip(label: Text('Chennai → Hyderabad')),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SeatSelectionPage extends StatefulWidget {
  final String tripId;
  
  SeatSelectionPage({required this.tripId});

  @override
  _SeatSelectionPageState createState() => _SeatSelectionPageState();
}

class _SeatSelectionPageState extends State<SeatSelectionPage> {
  List<String> selectedSeats = [];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Select Seats')),
      body: Column(
        children: [
          Expanded(
            child: GridView.builder(
              padding: EdgeInsets.all(16),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                childAspectRatio: 1,
              ),
              itemCount: 40,
              itemBuilder: (context, index) {
                String seat = 'L${index + 1}';
                bool isBooked = index % 3 == 0;
                
                return GestureDetector(
                  onTap: isBooked ? null : () {
                    setState(() {
                      if (selectedSeats.contains(seat)) {
                        selectedSeats.remove(seat);
                      } else {
                        selectedSeats.add(seat);
                      }
                    });
                  },
                  child: Container(
                    margin: EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: isBooked 
                        ? Colors.grey 
                        : selectedSeats.contains(seat) 
                          ? Colors.green 
                          : Colors.blue,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(seat, style: TextStyle(color: Colors.white)),
                    ),
                  ),
                );
              },
            ),
          ),
          if (selectedSeats.isNotEmpty)
            Padding(
              padding: EdgeInsets.all(16),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => PaymentPage()),
                  );
                },
                child: Text('Proceed to Payment (${selectedSeats.length} seats)'),
              ),
            ),
        ],
      ),
    );
  }
}

class PaymentPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Payment')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Amount: ₹500', style: TextStyle(fontSize: 24)),
            SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {},
              icon: Icon(Icons.payment),
              label: Text('Pay with UPI'),
            ),
            ElevatedButton.icon(
              onPressed: () {},
              icon: Icon(Icons.credit_card),
              label: Text('Pay with Card'),
            ),
            ElevatedButton.icon(
              onPressed: () {},
              icon: Icon(Icons.wallet_membership),
              label: Text('Pay with Wallet'),
            ),
          ],
        ),
      ),
    );
  }
}