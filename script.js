document.addEventListener('DOMContentLoaded', () => {
    const eventButtons = document.querySelectorAll('.event-button');
    const eventDetails = document.getElementById('event-details');
    const eventTitle = document.getElementById('event-title');
    const eventDate = document.getElementById('event-date');
    const eventImage = document.getElementById('event-image');
    const eventDescription = document.getElementById('event-description');
    const bookNowButton = document.querySelector('#eventModal .btn-primary.btn-block');
    const modalEventTitle = document.getElementById('modalEventTitle');
    const modalEventDate = document.getElementById('modalEventDate');
    const modalEventImage = document.getElementById('modalEventImage');
    const modalEventDescription = document.getElementById('modalEventDescription');
    const ticketOptionsContainer = document.getElementById('ticketOptions');

    const eventsData = {
        'music-festival': {
            title: 'Summer Beats Music Festival',
            date: 'August 17, 2024',
            time: '12:00 PM - 11:00 PM',
            location: 'Central Park, New York',
            description: 'Experience three days of non-stop music from world-renowned artists across multiple genres. From pop to rock, hip-hop to electronic, there\'s something for every music lover.',
            image: 'summer music.png',
            coordinates: [40.785091, -73.968285],
            ticketOptions: [
                {name: 'Single Day Pass', price: 89.99},
                {name: '3-Day Pass', price: 199.99},
                {name: 'VIP Experience', price: 349.99}
            ]
        },
        'art-exhibition': {
            title: 'Modern Perspectives: A Contemporary Art Showcase',
            date: 'September 10, 2024',
            time: '10:00 AM - 6:00 PM',
            location: 'Metropolitan Museum of Art, New York',
            description: 'Explore thought-provoking works from emerging and established artists in this two-week exhibition. Featuring a diverse range of mediums including paintings, sculptures, and interactive installations.',
            image: 'art festival.png',
            coordinates: [40.779437, -73.963244],
            ticketOptions: [
                {name: 'General Admission', price: 25},
                {name: 'Guided Tour', price: 40},
                {name: 'VIP Preview Night', price: 100}
            ]
        },
        'tech-conference': {
            title: 'FutureTech 2024: Innovation Summit',
            date: 'August 22, 2024',
            time: '9:00 AM - 5:00 PM',
            location: 'Javits Center, New York',
            description: 'Join industry leaders and innovators for three days of cutting-edge presentations, workshops, and networking opportunities. Explore the latest in AI, robotics, sustainable tech, and more.',
            image: 'tech festival.png',
            coordinates: [40.757205, -74.003625],
            ticketOptions: [
                {name: 'Standard Pass', price: 599},
                {name: 'Premium Pass (with workshops)', price: 899},
                {name: 'Executive Pass', price: 1299}
            ]
        },
        'food-festival': {
            title: 'Global Flavors Food Festival',
            date: 'September 7, 2024',
            time: '11:00 AM - 9:00 PM',
            location: 'Brooklyn Bridge Park, New York',
            description: 'Embark on a culinary journey around the world without leaving New York. Sample dishes from over 50 countries, attend cooking demonstrations, and enjoy live music and cultural performances.',
            image: 'food festival.png',
            coordinates: [40.702068, -73.996381],
            ticketOptions: [
                {name: 'General Admission', price: 20},
                {name: 'Tasting Pass (includes 10 food tokens)', price: 50},
                {name: 'VIP Experience (unlimited tastings + exclusive events)', price: 120}
            ]
        }
    };

    function handleBooking(event) {
        event.preventDefault();

        const form = document.getElementById('booking-form');
        const ticketType = form.querySelector('input[name="ticket-type"]:checked').value;
        const quantity = form.querySelector('#quantity').value;

        // Get the current event data
        const eventKey = document.querySelector('.event-button[data-event]').getAttribute('data-event');
        const eventData = eventsData[eventKey];

        // Store booking details in localStorage
        const bookingDetails = {
            ticketType: ticketType,
            quantity: quantity
        };
        localStorage.setItem('booking', JSON.stringify(bookingDetails));
        localStorage.setItem('eventDetails', JSON.stringify(eventData));

        // Redirect to the confirmation page
        window.location.href = 'event-confirmation.html';
    }

    eventButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventKey = button.getAttribute('data-event');
            openEventDetails(eventKey);
        });
    });

    function openEventDetails(eventKey) {
        const eventData = eventsData[eventKey];

        // Update the event details section with the selected event's data
        eventTitle.textContent = eventData.title;
        eventDate.textContent = `Date: ${eventData.date}`;
        eventDescription.textContent = eventData.description;
        eventImage.src = eventData.image;

        // Populate ticket options
        ticketOptionsContainer.innerHTML = ''; // Clear previous options
        eventData.ticketOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.innerHTML = `
                <label>
                    <input type="radio" name="ticket-type" value="${option.name}" required>
                    ${option.name} - $${option.price.toFixed(2)}
                </label>
            `;
            ticketOptionsContainer.appendChild(optionElement);
        });

        // Show the event details section
        eventDetails.classList.remove('hidden');

        // Smooth scroll to event details section
        eventDetails.scrollIntoView({ behavior: 'smooth' });
    }

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: Object.entries(eventsData).map(([key, event]) => ({
            title: event.title,
            start: new Date(event.date),
            allDay: true,
            extendedProps: {
                description: event.description,
                eventKey: key
            }
        })),
        eventClick: function(info) {
            const eventKey = info.event.extendedProps.eventKey;
            showEventModal(eventsData[eventKey]);
        }
    });
    calendar.render();

    function filterEvents() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const eventCards = document.querySelectorAll('.event-card');
        let firstMatch = null;

        eventCards.forEach(card => {
            const eventTitle = card.querySelector('h3').textContent.toLowerCase();
            if (eventTitle.includes(searchInput)) {
                card.style.display = 'block';
                if (!firstMatch) {
                    firstMatch = card;
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Scroll to the first matching event
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Add event listener for the search button
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', filterEvents);
    }

    // Add event listener for the search input (to search on Enter key press)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if it's in a form
                filterEvents();
            }
        });
    }
    function showEventModal(event) {
        const modalTitle = document.getElementById('modalEventTitle');
        const modalDate = document.getElementById('modalEventDate');
        const modalTime = document.getElementById('modalEventTime');
        const modalLocation = document.getElementById('modalEventLocation');
        const modalDescription = document.getElementById('modalEventDescription');
        const modalImage = document.getElementById('modalEventImage');
        const ticketOptions = document.getElementById('ticketOptions');
    
        modalTitle.textContent = event.title;
        modalDate.innerHTML = `<i class="far fa-calendar"></i> ${event.date}`;
        modalTime.innerHTML = `<i class="far fa-clock"></i> ${event.time}`;
        modalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.location}`;
        modalDescription.textContent = event.description;
        modalImage.src = event.image;
    
        ticketOptions.innerHTML = event.ticketOptions.map(option => `
            <div class="ticket-option">
                <span>${option.name}</span>
                <span>$${option.price}</span>
            </div>
        `).join('');
    
        if (typeof L !== 'undefined' && event.coordinates) {
            const map = L.map('eventMap').setView(event.coordinates, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
    
            L.marker(event.coordinates).addTo(map);
    
            setTimeout(() => {
                map.invalidateSize();
            }, 250);
        }
    
        const modal = new bootstrap.Modal(document.getElementById('eventModal'));
        modal.show();
    }

    // Add event listener to the booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }
});