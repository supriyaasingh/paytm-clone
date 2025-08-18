'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bus, 
  Train, 
  Film, 
  ArrowRight, 
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

export function TicketBooking() {
  const ticketServices = [
    {
      id: 'bus',
      icon: Bus,
      name: 'Bus Tickets',
      description: 'Book bus tickets across India',
      color: 'bg-green-100 text-green-600',
      features: ['Instant booking', '24/7 support', 'Easy cancellation']
    },
    {
      id: 'train',
      icon: Train,
      name: 'Train Tickets',
      description: 'IRCTC train booking made easy',
      color: 'bg-blue-100 text-blue-600',
      features: ['Live train status', 'Tatkal booking', 'PNR status']
    },
    {
      id: 'movie',
      icon: Film,
      name: 'Movie Tickets',
      description: 'Book movie tickets near you',
      color: 'bg-purple-100 text-purple-600',
      features: ['Seat selection', 'Instant confirmation', 'Food combos']
    }
  ];

  const handleBooking = (type: string) => {
    // This would normally redirect to booking page or open booking flow
    alert(`${type} booking will open in a new window (Demo)`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ticket Booking</CardTitle>
          <p className="text-gray-600">Book tickets for travel and entertainment</p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {ticketServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => handleBooking(service.name)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Routes/Shows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Popular This Week</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <Bus className="h-4 w-4 text-green-600" />
                <span>Popular Bus Routes</span>
              </h4>
              <div className="space-y-2">
                {['Delhi → Mumbai', 'Bangalore → Chennai', 'Pune → Goa'].map((route) => (
                  <Button
                    key={route}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-sm"
                    onClick={() => handleBooking('Bus')}
                  >
                    <span>{route}</span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>6-8hrs</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <Film className="h-4 w-4 text-purple-600" />
                <span>Now Showing</span>
              </h4>
              <div className="space-y-2">
                {['Avengers: Endgame', 'Spider-Man: No Way Home', 'The Batman'].map((movie) => (
                  <Button
                    key={movie}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-sm"
                    onClick={() => handleBooking('Movie')}
                  >
                    <span>{movie}</span>
                    <Badge variant="secondary" className="text-xs">
                      IMDB 8.4
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
