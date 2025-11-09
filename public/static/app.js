// React 18 with CDN
const { useState, useEffect, useCallback, useMemo } = React;

// Employee Management Component
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    address: ''
  });

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/employees';
      if (sortConfig.key) {
        url += `?sortBy=${sortConfig.key}&order=${sortConfig.direction}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data);
      } else {
        setError('Không thể tải danh sách nhân viên');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [sortConfig]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const url = editingEmployee 
        ? `/api/employees/${editingEmployee.id}`
        : '/api/employees';
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(editingEmployee ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
        resetForm();
        fetchEmployees();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Có lỗi xảy ra');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Xóa nhân viên thành công!');
        fetchEmployees();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Có lỗi xảy ra');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      email: employee.email,
      address: employee.address
    });
    setIsFormOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: 'male',
      email: '',
      address: ''
    });
    setEditingEmployee(null);
    setIsFormOpen(false);
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Get gender display text
  const getGenderDisplay = (gender) => {
    const genderMap = {
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác'
    };
    return genderMap[gender] || gender;
  };

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
    // Header
    React.createElement('header', { className: 'bg-white shadow-sm border-b border-gray-200' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('div', { className: 'flex items-center space-x-3' },
            React.createElement('div', { className: 'bg-indigo-600 text-white p-2 rounded-lg' },
              React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', 
                  d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
              )
            ),
            React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'Quản lý Nhân viên')
          ),
          React.createElement('div', { className: 'flex items-center space-x-2' },
            React.createElement('span', { className: 'text-sm text-gray-600' }, 
              `Tổng số: ${filteredEmployees.length} nhân viên`)
          )
        )
      )
    ),

    // Main Content
    React.createElement('main', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
      // Alerts
      error && React.createElement('div', { className: 'mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md' },
        React.createElement('div', { className: 'flex' },
          React.createElement('div', { className: 'flex-shrink-0' },
            React.createElement('svg', { className: 'h-5 w-5 text-red-400', fill: 'currentColor', viewBox: '0 0 20 20' },
              React.createElement('path', { fillRule: 'evenodd', 
                d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' })
            )
          ),
          React.createElement('div', { className: 'ml-3' },
            React.createElement('p', { className: 'text-sm text-red-700' }, error)
          )
        )
      ),

      successMessage && React.createElement('div', { className: 'mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md' },
        React.createElement('div', { className: 'flex' },
          React.createElement('div', { className: 'flex-shrink-0' },
            React.createElement('svg', { className: 'h-5 w-5 text-green-400', fill: 'currentColor', viewBox: '0 0 20 20' },
              React.createElement('path', { fillRule: 'evenodd',
                d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' })
            )
          ),
          React.createElement('div', { className: 'ml-3' },
            React.createElement('p', { className: 'text-sm text-green-700' }, successMessage)
          )
        )
      ),

      // Action Bar
      React.createElement('div', { className: 'bg-white rounded-lg shadow-sm p-4 mb-6' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-center gap-4' },
          React.createElement('div', { className: 'flex-1 w-full sm:w-auto' },
            React.createElement('div', { className: 'relative' },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Tìm kiếm theo tên, email, địa chỉ...',
                className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }),
              React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                React.createElement('svg', { className: 'h-5 w-5 text-gray-400', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                    d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                )
              )
            )
          ),
          React.createElement('button', {
            onClick: () => setIsFormOpen(true),
            className: 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2'
          },
            React.createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                d: 'M12 4v16m8-8H4' })
            ),
            React.createElement('span', {}, 'Thêm nhân viên')
          )
        )
      ),

      // Table
      React.createElement('div', { className: 'bg-white rounded-lg shadow-sm overflow-hidden' },
        React.createElement('div', { className: 'overflow-x-auto' },
          React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
            React.createElement('thead', { className: 'bg-gray-50' },
              React.createElement('tr', {},
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'ID'),
                React.createElement('th', { 
                  className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100',
                  onClick: () => handleSort('name')
                },
                  React.createElement('div', { className: 'flex items-center space-x-1' },
                    React.createElement('span', {}, 'Họ tên'),
                    React.createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                        d: sortConfig.key === 'name' && sortConfig.direction === 'asc' 
                          ? 'M5 15l7-7 7 7'
                          : 'M19 9l-7 7-7-7' })
                    )
                  )
                ),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Ngày sinh'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Giới tính'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Email'),
                React.createElement('th', { 
                  className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100',
                  onClick: () => handleSort('address')
                },
                  React.createElement('div', { className: 'flex items-center space-x-1' },
                    React.createElement('span', {}, 'Địa chỉ'),
                    React.createElement('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                        d: sortConfig.key === 'address' && sortConfig.direction === 'asc'
                          ? 'M5 15l7-7 7 7'
                          : 'M19 9l-7 7-7-7' })
                    )
                  )
                ),
                React.createElement('th', { className: 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'Thao tác')
              )
            ),
            React.createElement('tbody', { className: 'bg-white divide-y divide-gray-200' },
              filteredEmployees.length === 0 
                ? React.createElement('tr', {},
                    React.createElement('td', { colSpan: 7, className: 'px-6 py-12 text-center text-gray-500' },
                      React.createElement('div', { className: 'flex flex-col items-center' },
                        React.createElement('svg', { className: 'w-12 h-12 text-gray-400 mb-3', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                          React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                            d: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' })
                        ),
                        React.createElement('p', { className: 'text-sm' }, 'Không có dữ liệu nhân viên')
                      )
                    )
                  )
                : filteredEmployees.map(employee =>
                    React.createElement('tr', { key: employee.id, className: 'hover:bg-gray-50' },
                      React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900' }, 
                        `#${employee.id}`),
                      React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900' }, 
                        employee.name),
                      React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500' }, 
                        formatDate(employee.dateOfBirth)),
                      React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                        React.createElement('span', { 
                          className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                            employee.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`
                        }, getGenderDisplay(employee.gender))
                      ),
                      React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500' }, 
                        employee.email),
                      React.createElement('td', { className: 'px-6 py-4 text-sm text-gray-500' }, 
                        employee.address),
                      React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium' },
                        React.createElement('div', { className: 'flex justify-end space-x-2' },
                          React.createElement('button', {
                            onClick: () => handleEdit(employee),
                            className: 'text-indigo-600 hover:text-indigo-900 transition-colors'
                          },
                            React.createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                              React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                                d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
                            )
                          ),
                          React.createElement('button', {
                            onClick: () => handleDelete(employee.id),
                            className: 'text-red-600 hover:text-red-900 transition-colors'
                          },
                            React.createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                              React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                                d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
                            )
                          )
                        )
                      )
                    )
                  )
            )
          )
        )
      )
    ),

    // Modal Form
    isFormOpen && React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
      React.createElement('div', { className: 'bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto' },
        React.createElement('div', { className: 'sticky top-0 bg-white border-b border-gray-200 px-6 py-4' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-900' },
              editingEmployee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'
            ),
            React.createElement('button', {
              onClick: resetForm,
              className: 'text-gray-400 hover:text-gray-500'
            },
              React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2',
                  d: 'M6 18L18 6M6 6l12 12' })
              )
            )
          )
        ),
        React.createElement('form', { onSubmit: handleSubmit, className: 'p-6 space-y-4' },
          React.createElement('div', {},
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Họ tên *'),
            React.createElement('input', {
              type: 'text',
              name: 'name',
              required: true,
              value: formData.name,
              onChange: handleInputChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: 'Nhập họ tên'
            })
          ),
          React.createElement('div', {},
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Ngày sinh *'),
            React.createElement('input', {
              type: 'date',
              name: 'dateOfBirth',
              required: true,
              value: formData.dateOfBirth,
              onChange: handleInputChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            })
          ),
          React.createElement('div', {},
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Giới tính *'),
            React.createElement('select', {
              name: 'gender',
              required: true,
              value: formData.gender,
              onChange: handleInputChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            },
              React.createElement('option', { value: 'male' }, 'Nam'),
              React.createElement('option', { value: 'female' }, 'Nữ'),
              React.createElement('option', { value: 'other' }, 'Khác')
            )
          ),
          React.createElement('div', {},
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Email *'),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              required: true,
              value: formData.email,
              onChange: handleInputChange,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: 'example@email.com'
            })
          ),
          React.createElement('div', {},
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Địa chỉ *'),
            React.createElement('textarea', {
              name: 'address',
              required: true,
              value: formData.address,
              onChange: handleInputChange,
              rows: 3,
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: 'Nhập địa chỉ'
            })
          ),
          React.createElement('div', { className: 'flex justify-end space-x-3 pt-4' },
            React.createElement('button', {
              type: 'button',
              onClick: resetForm,
              className: 'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
            }, 'Hủy'),
            React.createElement('button', {
              type: 'submit',
              disabled: loading,
              className: 'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            }, loading ? 'Đang xử lý...' : (editingEmployee ? 'Cập nhật' : 'Thêm mới'))
          )
        )
      )
    )
  );
};

// Initialize React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(EmployeeManagement));