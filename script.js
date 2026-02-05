// Theme Toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Get saved theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeToggleButton(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleButton(newTheme);
        
        // Show toast notification
        const themeLabel = newTheme === 'dark' ? 'Dark' : 'Light';
        showToast(`✨ Switched to ${themeLabel} mode!`, 'success', 2000);
    });
}

function updateThemeToggleButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (theme === 'dark') {
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

// Toast Notification
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.classList.remove('show', 'hide');
        }, 400);
    }, duration);
}

// Calendar and Booking Functionality
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date();

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
    renderCalendar();
    generateTimeSlots();
    setupFAQ();
    setupBookingForm();
    setupPlanButtons();
});

// Calendar Functions
function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Update month/year display
    const monthYearElement = document.getElementById('monthYear');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Clear previous calendar
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, false, 'other-month');
        calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const isToday = currentDate.toDateString() === today.toDateString();
        const isPast = currentDate < today;
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        
        let classes = [];
        let isAvailable = true;
        
        if (isPast) {
            classes.push('disabled');
            isAvailable = false;
        } else if (!isWeekend) {
            classes.push('available');
        } else {
            classes.push('disabled');
            isAvailable = false;
        }
        
        if (selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === month && 
            selectedDate.getFullYear() === year) {
            classes.push('selected');
        }
        
        const dayElement = createDayElement(day, isAvailable, classes.join(' '));
        if (isAvailable) {
            dayElement.addEventListener('click', function() {
                selectDate(new Date(year, month, day));
            });
        }
        calendarDays.appendChild(dayElement);
    }
    
    // Add next month's days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, false, 'other-month');
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(day, isAvailable, classes = '') {
    const div = document.createElement('div');
    div.className = `day ${classes}`;
    div.textContent = day;
    if (!isAvailable) {
        div.style.cursor = 'not-allowed';
    }
    return div;
}

function selectDate(date) {
    selectedDate = date;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    
    document.getElementById('selectedDateDisplay').innerHTML = `<p>📅 ${dateString}</p>`;
    selectedTime = null;
    document.getElementById('selectedTimeDisplay').innerHTML = '<p>⏰ Pick a time slot</p>';
    
    renderCalendar();
}

function prevMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
}

// Set up month navigation buttons
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prevMonth').addEventListener('click', prevMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);
});
function generateTimeSlots() {
    const slots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];
    
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    slots.forEach(slot => {
        const button = document.createElement('button');
        button.className = 'time-slot';
        button.type = 'button';
        button.textContent = slot;
        button.addEventListener('click', function(e) {
            e.preventDefault();
            selectTime(slot, button);
        });
        timeSlotsContainer.appendChild(button);
    });
}

function selectTime(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    selectedTime = time;
    document.getElementById('selectedTimeDisplay').innerHTML = `<p>⏰ ${time}</p>`;
}

// Scroll to booking section
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    bookingSection.scrollIntoView({ behavior: 'smooth' });
}

// Setup plan buttons for toast notifications
function setupPlanButtons() {
    // Get all plan links
    const planLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    planLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            // Get the plan name from the text content
            const buttonText = this.textContent;
            const parent = this.closest('.pricing-card') || this.closest('section');
            
            if (buttonText.includes('Choose Plan') || buttonText.includes('Get Started')) {
                showToast(`✨ Awesome choice! Opening WhatsApp to connect you with our team...`, 'success', 3500);
            } else if (buttonText.includes('Start Your Journey') || buttonText.includes('Book Your Free')) {
                showToast(`🎉 Let's get started! Connecting to WhatsApp...`, 'success', 3500);
            }
        });
    });
}

// Modal functions
function openModal() {
    document.getElementById('videoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('videoModal').style.display = 'none';
}

window.addEventListener('click', function(e) {
    const modal = document.getElementById('videoModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('h4');
        header.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    faqItem.classList.toggle('active');
}

// Booking Form
function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate that date and time are selected
        if (!selectedDate || !selectedTime) {
            alert('Please select both a date and time before submitting.');
            return;
        }
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const goals = document.getElementById('goals').value;
        
        // Format date
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = selectedDate.toLocaleDateString('en-US', dateOptions);
        
        // Show success toast
        showToast(`🎉 Booking submitted! Opening WhatsApp to confirm...`, 'success', 3000);
        
        // Create WhatsApp message with booking details
        const whatsappMessage = `Hi Solidrest! I'd like to book a lesson with the following details:

Name: ${name}
Email: ${email}
Phone: ${phone}

📅 Preferred Date: ${dateString}
⏰ Preferred Time: ${selectedTime}

Musical Goals: ${goals}

Please confirm my booking!`;
        
        // Create WhatsApp link
        const whatsappLink = `https://wa.me/2348027592657?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp after short delay
        setTimeout(() => {
            window.open(whatsappLink, '_blank');
        }, 500);
        
        // Reset form
        form.reset();
        selectedDate = null;
        selectedTime = null;
        document.getElementById('selectedDateDisplay').innerHTML = '<p>📅 Select a date to continue</p>';
        document.getElementById('selectedTimeDisplay').innerHTML = '<p>⏰ Pick a time slot</p>';
        renderCalendar();
    });
}

function saveBooking(bookingData) {
    // Get existing bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('solidrestBookings') || '[]');
    
    // Add new booking
    bookings.push(bookingData);
    
    // Save back to localStorage
    localStorage.setItem('solidrestBookings', JSON.stringify(bookings));
    
    // Log for debugging
    console.log('Booking saved:', bookingData);
}

function showSuccessMessage(name, date, time) {
    // Create and show success modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    content.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
        <h2 style="color: #6366f1; margin-bottom: 1rem;">Booking Confirmed!</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
            Hi <strong>${name}</strong>, your lesson is scheduled!
        </p>
        <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <p style="margin: 0.5rem 0;"><strong>📅 Date:</strong> ${date}</p>
            <p style="margin: 0.5rem 0;"><strong>⏰ Time:</strong> ${time}</p>
            <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #6366f1;">
                ✓ Check your email for the Zoom link (24 hours before lesson)
            </p>
        </div>
        <p style="color: #64748b; margin-bottom: 1.5rem;">
            We'll send you a confirmation email shortly. Get your keyboard ready!
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #6366f1, #ec4899);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
            Amazing! I'm Ready
        </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Remove modal after 10 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 10000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll animation for elements
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.benefit-card, .testimonial-card, .pricing-card, .step');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight * 0.75 && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize scroll animations
window.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.benefit-card, .testimonial-card, .pricing-card, .step');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });
});

// Add keyboard event listener for ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('videoModal');
        if (modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Prevent form submission with Enter key (unless clicking submit button)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target !== form.querySelector('[type="submit"]')) {
                e.preventDefault();
            }
        });
    }
});
