import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Employee interface
interface Employee {
  id: string
  name: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  email: string
  address: string
  createdAt?: string
  updatedAt?: string
}

// In-memory storage (will be replaced with D1 in production)
let employees: Employee[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    email: 'an.nguyen@email.com',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    dateOfBirth: '1992-08-20',
    gender: 'female',
    email: 'binh.tran@email.com',
    address: '456 Lê Lợi, Quận 3, TP.HCM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    dateOfBirth: '1988-12-10',
    gender: 'male',
    email: 'cuong.le@email.com',
    address: '789 Hai Bà Trưng, Quận Tân Bình, TP.HCM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/favicon.ico', serveStatic({ root: './public' }))

// API Routes

// Get all employees with optional sorting
app.get('/api/employees', (c) => {
  const sortBy = c.req.query('sortBy')
  const order = c.req.query('order') || 'asc'

  let sortedEmployees = [...employees]

  if (sortBy === 'name' || sortBy === 'address') {
    sortedEmployees.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase()
      const bValue = b[sortBy].toLowerCase()
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  return c.json({
    success: true,
    data: sortedEmployees,
    total: sortedEmployees.length
  })
})

// Get employee by ID
app.get('/api/employees/:id', (c) => {
  const id = c.req.param('id')
  const employee = employees.find(e => e.id === id)

  if (!employee) {
    return c.json({ success: false, error: 'Employee not found' }, 404)
  }

  return c.json({ success: true, data: employee })
})

// Create new employee
app.post('/api/employees', async (c) => {
  try {
    const body = await c.req.json<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>()
    
    // Validation
    if (!body.name || !body.email || !body.dateOfBirth || !body.gender || !body.address) {
      return c.json({ success: false, error: 'Missing required fields' }, 400)
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return c.json({ success: false, error: 'Invalid email format' }, 400)
    }

    // Check for duplicate email
    if (employees.some(e => e.email === body.email)) {
      return c.json({ success: false, error: 'Email already exists' }, 400)
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    employees.push(newEmployee)

    return c.json({ success: true, data: newEmployee }, 201)
  } catch (error) {
    return c.json({ success: false, error: 'Invalid request body' }, 400)
  }
})

// Update employee
app.put('/api/employees/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json<Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>>()
    
    const index = employees.findIndex(e => e.id === id)
    if (index === -1) {
      return c.json({ success: false, error: 'Employee not found' }, 404)
    }

    // Email validation if email is being updated
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return c.json({ success: false, error: 'Invalid email format' }, 400)
      }

      // Check for duplicate email (excluding current employee)
      if (employees.some(e => e.email === body.email && e.id !== id)) {
        return c.json({ success: false, error: 'Email already exists' }, 400)
      }
    }

    employees[index] = {
      ...employees[index],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return c.json({ success: true, data: employees[index] })
  } catch (error) {
    return c.json({ success: false, error: 'Invalid request body' }, 400)
  }
})

// Delete employee
app.delete('/api/employees/:id', (c) => {
  const id = c.req.param('id')
  const index = employees.findIndex(e => e.id === id)

  if (index === -1) {
    return c.json({ success: false, error: 'Employee not found' }, 404)
  }

  const deletedEmployee = employees.splice(index, 1)[0]
  return c.json({ success: true, data: deletedEmployee })
})

// Health check
app.get('/api/health', (c) => {
  return c.json({ success: true, status: 'OK', timestamp: new Date().toISOString() })
})

// Serve the main HTML page
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Nhân viên - Employee Management System</title>
    <link rel="icon" href="/favicon.ico">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- React 18 -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app