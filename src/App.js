import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [display, setDisplay] = useState('all');

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data,"data is here");

        // Ensure data.tickets is valid
        const tickets = Array.isArray(data.tickets) ? data.tickets : [];
        console.log('Fetched Tickets:', tickets);

        setTickets(tickets);
        setGroupedData(groupTickets(tickets, 'status'));
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  // Group tickets by selected criteria
  const groupTickets = (data, groupBy) => {
    if (!Array.isArray(data)) return [];
    const grouped = data.reduce((acc, ticket) => {
      const key = ticket[groupBy] || 'Ungrouped';
      acc[key] = acc[key] || [];
      acc[key].push(ticket);
      return acc;
    }, {});
    return Object.entries(grouped);
  };

  // Handle grouping change
  const handleGroupChange = (e) => {
    const newGroupBy = e.target.value;
    setGroupBy(newGroupBy);
    setGroupedData(groupTickets(tickets, newGroupBy));
  };

  // Handle display change
  const handleDisplayChange = (e) => {
    const displayOption = e.target.value;
    setDisplay(displayOption);

    if (!Array.isArray(tickets)) return;

    let filteredTickets = [...tickets];
    if (displayOption === 'high-priority') {
      filteredTickets = tickets.filter((ticket) => ticket.priority >= 3); // High and Urgent
    } else if (displayOption === 'low-priority') {
      filteredTickets = tickets.filter((ticket) => ticket.priority < 3); // Medium and Low
    }

    setGroupedData(groupTickets(filteredTickets, groupBy));
  };

  return (
    <div className="App">
      <header>
        <h1>Kanban Board</h1>
      </header>

      <div className="controls">
        <label>
          Group By:
          <select value={groupBy} onChange={handleGroupChange}>
            <option value="status">Status</option>
            <option value="name">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>

        <label>
          Display:
          <select value={display} onChange={handleDisplayChange}>
            <option value="all">All</option>
            <option value="high-priority">High Priority</option>
            <option value="low-priority">Low Priority</option>
          </select>
        </label>
      </div>

      <div className="kanban-board">
        {groupedData.map(([group, tickets]) => (
          <div key={group} className="kanban-column">
            <h2>{group}</h2>
            {tickets.map((ticket) => (
              <div key={ticket.id} className="kanban-card">
                <p>{ticket.id}</p>
                <h3>{ticket.title}</h3>
                <p>Priority: {ticket.priority}</p>
                <p>Status: {ticket.status}</p>
                <p>User: {ticket.name || 'Unassigned'}</p> {/* Updated Field */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
