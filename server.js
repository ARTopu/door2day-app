import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const SERVICES_FILE = path.join(__dirname, 'services.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize services file if it doesn't exist
async function initializeServicesFile() {
  try {
    await fs.access(SERVICES_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(SERVICES_FILE, JSON.stringify([], null, 2));
  }
}

// Helper function to read services
async function readServices() {
  try {
    const data = await fs.readFile(SERVICES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

// Helper function to write services
async function writeServices(services) {
  try {
    await fs.writeFile(SERVICES_FILE, JSON.stringify(services, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing services:', error);
    return false;
  }
}

// Routes

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await readServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get services by display category
app.get('/api/services/category/:category', async (req, res) => {
  try {
    const services = await readServices();
    const { category } = req.params;
    const filteredServices = services.filter(service => 
      service.displayCategory === category
    );
    res.json(filteredServices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services by category' });
  }
});

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
  try {
    const services = await readServices();
    const service = services.find(s => s.id === parseInt(req.params.id));
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create new service
app.post('/api/services', async (req, res) => {
  try {
    const services = await readServices();
    const newService = {
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    services.push(newService);
    const success = await writeServices(services);
    
    if (success) {
      res.status(201).json(newService);
    } else {
      res.status(500).json({ error: 'Failed to create service' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
app.put('/api/services/:id', async (req, res) => {
  try {
    const services = await readServices();
    const serviceIndex = services.findIndex(s => s.id === parseInt(req.params.id));
    
    if (serviceIndex === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...req.body,
      id: parseInt(req.params.id),
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeServices(services);
    
    if (success) {
      res.json(services[serviceIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update service' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const services = await readServices();
    const filteredServices = services.filter(s => s.id !== parseInt(req.params.id));
    
    if (services.length === filteredServices.length) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const success = await writeServices(filteredServices);
    
    if (success) {
      res.json({ message: 'Service deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete service' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Initialize and start server
async function startServer() {
  await initializeServicesFile();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
