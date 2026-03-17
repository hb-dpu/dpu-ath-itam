const { useState, useEffect } = React;

// API Base URL - automatically uses current protocol, hostname and port
const API_BASE_URL = (() => {
  // If we're on localhost, use http://localhost:3000
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  
  // If we're on HTTPS, use HTTPS with port 3443
  if (window.location.protocol === 'https:') {
    return `https://${window.location.hostname}:3443`;
  }
  
  // Otherwise use HTTP with port 3000
  return `http://${window.location.hostname}:3000`;
})();

// Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-gray-700 bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 backdrop-blur-sm"
      aria-label="Scroll to top"
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 15l7-7 7 7" 
        />
      </svg>
    </button>
  );
};

const ITAMApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [software, setSoftware] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('device');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [scannedAssetTag, setScannedAssetTag] = useState(null);
  const [viewingDevice, setViewingDevice] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState(null);
  const [viewingSoftware, setViewingSoftware] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // { username, isAdmin }

  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load devices
        const devicesResponse = await fetch(`${API_BASE_URL}/api/devices`);
        const devicesData = await devicesResponse.json();
        setDevices(devicesData);
        
        // Load users
        const usersResponse = await fetch(`${API_BASE_URL}/api/users`);
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Load software
        const softwareResponse = await fetch(`${API_BASE_URL}/api/software`);
        const softwareData = await softwareResponse.json();
        setSoftware(softwareData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fall back to sample data if server is not available
        loadSampleData();
        loadSampleUsers();
      }
    };
    
    loadData();
  }, []);

  // Save devices to backend whenever they change
  useEffect(() => {
    if (devices.length > 0) {
      fetch(`${API_BASE_URL}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devices)
      }).catch(error => console.error('Error saving devices:', error));
    }
  }, [devices]);

  // Save users to backend whenever they change
  useEffect(() => {
    if (users.length > 0) {
      fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      }).catch(error => console.error('Error saving users:', error));
    }
  }, [users]);

  // Save software to backend whenever they change
  useEffect(() => {
    if (software.length > 0) {
      fetch(`${API_BASE_URL}/api/software`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(software)
      }).catch(error => console.error('Error saving software:', error));
    }
  }, [software]);

  const loadSampleData = () => {
    setDevices([
      {
        id: '1',
        assetTag: 'DPA-LAP-001',
        serialNumber: 'SN123456789',
        manufacturer: 'Dell',
        model: 'Latitude 7420',
        purchaseDate: '2023-01-15',
        warrantyEnd: '2026-01-15',
        purchasePrice: '1299.99',
        assignedTo: 'John Smith',
        notes: 'Primary laptop for Head Coach'
      },
      {
        id: '2',
        assetTag: 'DPA-DES-002',
        serialNumber: 'SN987654321',
        manufacturer: 'HP',
        model: 'EliteDesk 800 G8',
        purchaseDate: '2022-08-20',
        warrantyEnd: '2025-08-20',
        purchasePrice: '899.00',
        assignedTo: 'Sarah Johnson',
        notes: 'Office workstation'
      },
      {
        id: '3',
        assetTag: 'DPA-IPD-003',
        serialNumber: 'DMQX2LL/A',
        manufacturer: 'Apple',
        model: 'iPad Pro 12.9"',
        purchaseDate: '2023-03-10',
        warrantyEnd: '2024-03-10',
        purchasePrice: '1099.00',
        assignedTo: 'Mike Williams',
        notes: 'Video analysis'
      }
    ]);
  };

  const loadSampleUsers = () => {
    setUsers([
      { id: '1', name: 'John Smith', department: 'Coaching', email: 'jsmith@depaul.edu' },
      { id: '2', name: 'Sarah Johnson', department: 'Administration', email: 'sjohnson@depaul.edu' },
      { id: '3', name: 'Mike Williams', department: 'Training', email: 'mwilliams@depaul.edu' }
    ]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const userData = { username: data.username, isAdmin: data.isAdmin };
        setLoggedInUser(userData);
        window.loggedInUser = userData; // Make it globally accessible for SettingsTab
        setIsAuthenticated(true);
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please make sure the server is running.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const addDevice = (device) => {
    const newDevice = { ...device, id: Date.now().toString() };
    setDevices([...devices, newDevice]);
    setShowAddDevice(false);
  };

  const updateDevice = (updatedDevice) => {
    setDevices(devices.map(d => d.id === updatedDevice.id ? updatedDevice : d));
    setEditingDevice(null);
  };

  const deleteDevice = (id) => {
    if (confirm('Are you sure you want to delete this device?')) {
      setDevices(devices.filter(d => d.id !== id));
    }
  };

  const addUser = (user) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  const updateUser = (updatedUser) => {
    const oldName = users.find(u => u.id === updatedUser.id)?.name;
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    // Update device assignments
    if (oldName !== updatedUser.name) {
      setDevices(devices.map(d => 
        d.assignedTo === oldName ? { ...d, assignedTo: updatedUser.name } : d
      ));
    }
    setEditingUser(null);
  };

  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user? Their device assignments will be cleared.')) {
      const userName = users.find(u => u.id === id)?.name;
      setUsers(users.filter(u => u.id !== id));
      setDevices(devices.map(d => d.assignedTo === userName ? { ...d, assignedTo: '' } : d));
    }
  };

  const addSoftware = (softwareItem) => {
    const newSoftware = { ...softwareItem, id: Date.now().toString() };
    setSoftware([...software, newSoftware]);
    setShowAddSoftware(false);
  };

  const updateSoftware = (updatedSoftware) => {
    setSoftware(software.map(s => s.id === updatedSoftware.id ? updatedSoftware : s));
    setEditingSoftware(null);
  };

  const deleteSoftware = (id) => {
    if (confirm('Are you sure you want to delete this software license?')) {
      setSoftware(software.filter(s => s.id !== id));
    }
  };

  const filteredDevices = devices.filter(device => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    if (searchType === 'device') {
      return device.assetTag.toLowerCase().includes(term) ||
             device.serialNumber.toLowerCase().includes(term) ||
             device.manufacturer.toLowerCase().includes(term) ||
             device.model.toLowerCase().includes(term);
    } else {
      return device.assignedTo?.toLowerCase().includes(term);
    }
  });

  const filteredSoftware = software.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    return item.softwareName.toLowerCase().includes(term) ||
           item.vendor.toLowerCase().includes(term) ||
           item.licenseType.toLowerCase().includes(term);
  });

  const getUserDevices = (userName) => {
    return devices.filter(d => d.assignedTo === userName);
  };

  const getAutocompleteResults = () => {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    
    if (searchType === 'device') {
      // Search devices by asset tag or serial number
      return devices
        .filter(d => 
          d.assetTag.toLowerCase().includes(term) || 
          d.serialNumber.toLowerCase().includes(term)
        )
        .slice(0, 5);
    } else if (searchType === 'software') {
      // Search software by name or vendor
      return software
        .filter(s =>
          s.softwareName.toLowerCase().includes(term) ||
          s.vendor.toLowerCase().includes(term)
        )
        .slice(0, 5);
    } else {
      // Search users by name
      return users
        .filter(u => u.name.toLowerCase().includes(term))
        .slice(0, 5);
    }
  };

  const handleAutocompleteSelect = (item) => {
    if (searchType === 'device') {
      setSearchTerm(item.assetTag);
    } else if (searchType === 'software') {
      setSearchTerm(item.softwareName);
    } else {
      setSearchTerm(item.name);
    }
    setShowAutocomplete(false);
  };

  const handleBarcodeScan = (decodedText) => {
    // Close scanner
    setShowBarcodeScanner(false);
    
    // Search for device with this asset tag
    const existingDevice = devices.find(d => 
      d.assetTag.toLowerCase() === decodedText.toLowerCase()
    );
    
    if (existingDevice) {
      // Device exists - open details view
      setViewingDevice(existingDevice);
      setScannedAssetTag(null);
    } else {
      // Device doesn't exist - open add modal with asset tag pre-filled
      setScannedAssetTag(decodedText);
      setShowAddDevice(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md">
            <div className="text-center mb-10">
              {/* DePaul Logo */}
              <div className="flex justify-center mb-4">
                <img src="logo.png" alt="DePaul Logo" className="w-20 h-21" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">DePaul Athletics</h1>
              <h2 className="text-base text-gray-500 font-medium">IT Asset Management</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6">
          <p className="text-center text-xs text-gray-500">
            Built by <span className="font-semibold text-gray-700">Hayden Blair</span> in <span className="font-semibold text-gray-700">Chicago, IL</span>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Apple-inspired clean white design */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-blue-600 tracking-tight font-bold">DePaul Athletics ITAM</h1>
            <p className="text-gray-500 text-sm font-medium mt-0.5">IT Asset Management System</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200-all duration-200"
          >
            <span className="text-base">👋</span>
            <span>Logout</span>
          </button>
        </div>
        
        {/* Tab Navigation - Apple iOS-style tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
                activeTab === 'home' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🏠</span>
                <span>Home</span>
              </span>
              {activeTab === 'home' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
                activeTab === 'devices' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>💻</span>
                <span>Devices</span>
              </span>
              {activeTab === 'devices' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
                activeTab === 'software' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📦</span>
                <span>Software</span>
              </span>
              {activeTab === 'software' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
                activeTab === 'users' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👥</span>
                <span>Users</span>
              </span>
              {activeTab === 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-3 font-semibold text-sm transition-all duration-200 relative ${
                activeTab === 'settings' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>⚙️</span>
                <span>Settings</span>
              </span>
              {activeTab === 'settings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {activeTab === 'home' && (
          <HomeTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            showAutocomplete={showAutocomplete}
            setShowAutocomplete={setShowAutocomplete}
            getAutocompleteResults={getAutocompleteResults}
            handleAutocompleteSelect={handleAutocompleteSelect}
            filteredDevices={filteredDevices}
            filteredSoftware={filteredSoftware}
            users={users}
            getUserDevices={getUserDevices}
            showBarcodeScanner={showBarcodeScanner}
            setShowBarcodeScanner={setShowBarcodeScanner}
            handleBarcodeScan={handleBarcodeScan}
            setViewingDevice={setViewingDevice}
            setViewingSoftware={setViewingSoftware}
            setViewingUser={setViewingUser}
          />
        )}
        {activeTab === 'devices' && (
          <DevicesTab
            devices={devices}
            setShowAddDevice={setShowAddDevice}
            setEditingDevice={setEditingDevice}
            deleteDevice={deleteDevice}
            setViewingDevice={setViewingDevice}
          />
        )}
        {activeTab === 'software' && (
          <SoftwareTab
            software={software}
            users={users}
            setShowAddSoftware={setShowAddSoftware}
            setEditingSoftware={setEditingSoftware}
            deleteSoftware={deleteSoftware}
            setViewingSoftware={setViewingSoftware}
          />
        )}
        {activeTab === 'users' && (
          <UsersTab
            users={users}
            getUserDevices={getUserDevices}
            setShowAddUser={setShowAddUser}
            setEditingUser={setEditingUser}
            setViewingUser={setViewingUser}
            deleteUser={deleteUser}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowBarcodeScanner(false)}
          title="Scan Asset Tag Barcode"
        />
      )}

      {/* Device Details Modal */}
      {viewingDevice && (
        <DeviceDetailsModal
          device={viewingDevice}
          onClose={() => setViewingDevice(null)}
          onEdit={setEditingDevice}
          onDelete={deleteDevice}
        />
      )}

      {/* User Details Modal */}
      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          devices={devices}
          software={software}
          onClose={() => setViewingUser(null)}
          onEdit={setEditingUser}
          onDelete={deleteUser}
        />
      )}

      {/* Software Details Modal */}
      {viewingSoftware && (
        <SoftwareDetailsModal
          software={viewingSoftware}
          onClose={() => setViewingSoftware(null)}
          onEdit={setEditingSoftware}
          onDelete={deleteSoftware}
        />
      )}

      {/* Modals */}
      {(showAddDevice || editingDevice) && (
        <DeviceModal
          device={editingDevice}
          users={users}
          onSave={editingDevice ? updateDevice : addDevice}
          onClose={() => {
            setShowAddDevice(false);
            setEditingDevice(null);
            setScannedAssetTag(null);
          }}
          initialAssetTag={scannedAssetTag}
        />
      )}

      {(showAddUser || editingUser) && (
        <UserModal
          user={editingUser}
          onSave={editingUser ? updateUser : addUser}
          onClose={() => {
            setShowAddUser(false);
            setEditingUser(null);
          }}
        />
      )}

      {(showAddSoftware || editingSoftware) && (
        <SoftwareModal
          software={editingSoftware}
          users={users}
          onSave={editingSoftware ? updateSoftware : addSoftware}
          onClose={() => {
            setShowAddSoftware(false);
            setEditingSoftware(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="py-6">
        <p className="text-center text-xs text-gray-500">
          Built by <span className="font-semibold text-gray-700">Hayden Blair</span> in <span className="font-semibold text-gray-700">Chicago, IL</span>
        </p>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};


// Barcode Scanner Component
const BarcodeScanner = ({ onScan, onClose, title = "Scan Barcode", mode = "barcode" }) => {
  const scannerRef = React.useRef(null);
  const [error, setError] = React.useState(null);
  const [isScanning, setIsScanning] = React.useState(false);

  React.useEffect(() => {
    let html5QrCode = null;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("barcode-reader");
        
        // Different configurations based on mode
        const config = mode === "serial" ? {
          fps: 10,
          qrbox: { width: 400, height: 200 }, // Taller box for serial numbers
          aspectRatio: 2.0,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.QR_CODE // Apple serials sometimes in QR
          ]
        } : {
          fps: 10,
          qrbox: { width: 400, height: 150 }, // Wider box for 1D barcodes
          aspectRatio: 2.67, // Better for horizontal barcodes
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E
          ]
        };

        await html5QrCode.start(
          { facingMode: "environment" }, // Use back camera
          config,
          (decodedText) => {
            // Successfully scanned
            html5QrCode.stop().then(() => {
              onScan(decodedText);
            }).catch(err => console.error("Stop error:", err));
          },
          (errorMessage) => {
            // Scanning errors (ignore - happens frequently while scanning)
          }
        );
        
        setIsScanning(true);
      } catch (err) {
        console.error("Scanner start error:", err);
        setError("Unable to access camera. Please check camera permissions.");
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Cleanup error:", err));
      }
    };
  }, [onScan, mode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-2">
              Make sure you've granted camera permissions to your browser.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-500200 text-blue-800 p-4 rounded-lg mb-4">
              {mode === "serial" ? (
                <>
                  <p className="text-sm font-medium">📷 Scanning for Serial Numbers</p>
                  <p className="text-sm mt-1">
                    • For Apple products: Scan barcode on device or packaging<br/>
                    • For engraved serials: Hold device steady with good lighting<br/>
                    • Supports both 1D barcodes and QR codes<br/>
                    • The scanner will automatically detect it
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">📷 Scanning for 1D Barcodes (Code 128, Code 39, UPC, EAN)</p>
                  <p className="text-sm mt-1">
                    • Hold the barcode horizontally within the frame<br/>
                    • Keep it steady and well-lit<br/>
                    • The scanner will automatically detect it
                  </p>
                </>
              )}
            </div>

            <div id="barcode-reader" className="w-full rounded-lg overflow-hidden"></div>

            {isScanning && (
              <div className="mt-4 text-center text-gray-600">
                <p className="animate-pulse">🔍 Scanning...</p>
                {mode === "serial" ? (
                  <p className="text-sm mt-2">Tip: For engraved serials, ensure good lighting and focus</p>
                ) : (
                  <p className="text-sm mt-2">Tip: Make sure the barcode fills most of the scanning area</p>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Devices Tab Component
const DevicesTab = ({ devices, setShowAddDevice, setEditingDevice, deleteDevice, setViewingDevice }) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Devices</h2>
          <button
            onClick={() => setShowAddDevice(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ➕ Add Device
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {devices.map(device => (
          <div 
            key={device.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
            onClick={() => setViewingDevice(device)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{device.assetTag}</h3>
                <p className="text-gray-600">{device.manufacturer} {device.model}</p>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setEditingDevice(device)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  title="Edit device"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteDevice(device.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  title="Delete device"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  🔢 Serial Number
                </span>
                <p className="font-medium">{device.serialNumber}</p>
              </div>
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  👤 Assigned To
                </span>
                <p className="font-medium">{device.assignedTo || 'Unassigned'}</p>
              </div>
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  📅 Purchase Date
                </span>
                <p className="font-medium">{device.purchaseDate}</p>
              </div>
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  🛡️ Warranty End
                </span>
                <p className="font-medium">{device.warrantyEnd}</p>
              </div>
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  💵 Purchase Price
                </span>
                <p className="font-medium">${device.purchasePrice}</p>
              </div>
              {device.notes && (
                <div className="col-span-2 md:col-span-3">
                  <span className="text-gray-500">Notes</span>
                  <p className="font-medium truncate">{device.notes}</p>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
              💡 Click to view details
            </div>
          </div>
        ))}
        {devices.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            No devices in the system. Click "Add Device" to get started.
          </div>
        )}
      </div>
    </>
  );
};

// Software Tab Component
const SoftwareTab = ({ software, users, setShowAddSoftware, setEditingSoftware, deleteSoftware, setViewingSoftware }) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Software Licenses</h2>
          <button
            onClick={() => setShowAddSoftware(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ➕ Add License
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {software.map(item => {
          const availableSeats = item.totalLicenses - (item.assignedUsers?.length || 0);
          const isExpiringSoon = item.renewalDate && 
            new Date(item.renewalDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          return (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => setViewingSoftware(item)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{item.softwareName}</h3>
                  <p className="text-gray-600">{item.vendor} • {item.licenseType}</p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEditingSoftware(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title="Edit license"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteSoftware(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Delete license"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500 flex items-center gap-1">
                    🔢 Total Licenses
                  </span>
                  <p className="font-medium text-lg">{item.totalLicenses}</p>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center gap-1">
                    👥 Assigned
                  </span>
                  <p className="font-medium text-lg">{item.assignedUsers?.length || 0}</p>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center gap-1">
                    ✅ Available
                  </span>
                  <p className={`font-medium text-lg ${availableSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {availableSeats}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center gap-1">
                    💵 Annual Cost
                  </span>
                  <p className="font-medium text-lg">${item.annualCost}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">📅 Purchase Date</span>
                  <p className="font-medium">{item.purchaseDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">🔄 Renewal Date</span>
                  <p className={`font-medium ${isExpiringSoon ? 'text-orange-600' : ''}`}>
                    {item.renewalDate}
                    {isExpiringSoon && ' ⚠️'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">🔑 License Key</span>
                  <p className="font-medium font-mono text-xs truncate">
                    {item.licenseKey ? '••••••••••••' : 'Not provided'}
                  </p>
                </div>
              </div>

              {item.assignedUsers && item.assignedUsers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Assigned to:</strong> {item.assignedUsers.slice(0, 3).join(', ')}
                    {item.assignedUsers.length > 3 && ` +${item.assignedUsers.length - 3} more`}
                  </p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
                💡 Click to view details
              </div>
            </div>
          );
        })}
        {software.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            No software licenses in the system. Click "Add License" to get started.
          </div>
        )}
      </div>
    </>
  );
};

// Users Tab Component
const UsersTab = ({ users, getUserDevices, setShowAddUser, setEditingUser, setViewingUser, deleteUser }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = React.createRef();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/users/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadResult({
          success: true,
          message: `Upload complete! Added ${result.added} new users, skipped ${result.skipped} existing users.`
        });
        
        // Reload users after upload
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setUploadResult({
          success: false,
          message: result.error || 'Upload failed'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Error uploading file. Please try again.'
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
              📤 {uploading ? 'Uploading...' : 'Upload Excel'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              ➕ Add User
            </button>
          </div>
        </div>
        
        {/* Upload Result Message */}
        {uploadResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            uploadResult.success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-medium">{uploadResult.message}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(user => {
          const userDevices = getUserDevices(user.name);
          return (
            <div 
              key={user.id} 
              onClick={() => setViewingUser(user)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.department}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  📦 {userDevices.length} device{userDevices.length !== 1 ? 's' : ''} assigned
                </p>
                <p className="text-xs text-gray-500 mt-1">Click to view details</p>
              </div>
            </div>
          );
        })}
        {users.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            No users in the system. Click "Add User" to get started.
          </div>
        )}
      </div>
    </>
  );
};

// Settings Tab Component (Admin Only)
const SettingsTab = () => {
  const [accounts, setAccounts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load accounts (admin only)
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/backup`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `itam-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Backup downloaded successfully!');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Failed to download backup');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!confirm('WARNING: This will replace ALL existing data. Are you sure?')) {
      event.target.value = '';
      return;
    }

    try {
      setLoading(true);
      const text = await file.text();
      const backup = JSON.parse(text);

      const response = await fetch(`${API_BASE_URL}/api/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backup)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Restore complete!\nDevices: ${result.restored.devices}\nUsers: ${result.restored.users}\nSoftware: ${result.restored.software}`);
        window.location.reload();
      } else {
        alert('Restore failed: ' + result.error);
      }
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Failed to restore backup. Make sure the file is valid.');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup/Restore Section - Admin Only */}
      {window.loggedInUser?.isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Backup & Restore</h2>
          <p className="text-gray-600 mb-6">
            Download a backup of all ITAM data or restore from a previous backup.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadBackup}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              📥 Download Data File
            </button>
            
            <label className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition cursor-pointer">
              📤 Upload Data File
              <input
                type="file"
                accept=".json"
                onChange={handleUploadRestore}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Warning:</strong> Uploading a data file will replace ALL existing data. Make sure to download a backup first!
            </p>
          </div>
        </div>
      )}

      {/* Account Management Section - Admin Only */}
      {window.loggedInUser?.isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">👤 User Accounts</h2>
            <button
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              ➕ Add Account
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map(account => (
              <div key={account.username} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{account.username}</p>
                  <p className="text-sm text-gray-600">
                    {account.isAdmin ? '👑 Administrator' : '👤 Standard User'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingAccount(account)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title="Edit account"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete account "${account.username}"?`)) {
                        try {
                          const response = await fetch(`${API_BASE_URL}/api/accounts/${account.username}`, {
                            method: 'DELETE'
                          });
                          const result = await response.json();
                          if (result.success) {
                            loadAccounts();
                          } else {
                            alert(result.error);
                          }
                        } catch (error) {
                          alert('Failed to delete account');
                        }
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Delete account"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password Section - Standard Users */}
      {!window.loggedInUser?.isAdmin && (
        <ChangePasswordSection username={window.loggedInUser?.username} />
      )}

      {/* Add/Edit Account Modal - Admin Only */}
      {(showAddAccount || editingAccount) && (
        <AccountModal
          account={editingAccount}
          onSave={async (accountData) => {
            try {
              if (editingAccount) {
                // Update
                const response = await fetch(`${API_BASE_URL}/api/accounts/${editingAccount.username}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(accountData)
                });
                const result = await response.json();
                if (result.success) {
                  setEditingAccount(null);
                  loadAccounts();
                } else {
                  alert(result.error);
                }
              } else {
                // Create
                const response = await fetch(`${API_BASE_URL}/api/accounts`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(accountData)
                });
                const result = await response.json();
                if (result.success) {
                  setShowAddAccount(false);
                  loadAccounts();
                } else {
                  alert(result.error);
                }
              }
            } catch (error) {
              alert('Failed to save account');
            }
          }}
          onClose={() => {
            setShowAddAccount(false);
            setEditingAccount(null);
          }}
        />
      )}
    </div>
  );
};

// Change Password Section for Standard Users
const ChangePasswordSection = ({ username }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }

    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      // First verify current password by attempting login
      const loginResponse = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password: formData.currentPassword 
        })
      });

      const loginResult = await loginResponse.json();

      if (!loginResult.success) {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
        return;
      }

      // Now update the password
      const updateResponse = await fetch(`${API_BASE_URL}/api/accounts/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.newPassword })
      });

      const updateResult = await updateResponse.json();

      if (updateResult.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: updateResult.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">🔒 Change Password</h2>
      <p className="text-gray-600 mb-6">
        Logged in as: <strong>{username}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password *
          </label>
          <input
            type="password"
            required
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password *
          </label>
          <input
            type="password"
            required
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new password (min 6 characters)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password *
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Re-enter new password"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

// Account Modal Component
const AccountModal = ({ account, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    username: account?.username || '',
    password: '',
    isAdmin: account?.isAdmin || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!account && !formData.password) {
      alert('Password is required for new accounts');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {account ? 'Edit Account' : 'Add New Account'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
            <input
              type="text"
              required
              disabled={!!account}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              placeholder="username"
            />
            {account && (
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password {account && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder={account ? "Enter new password to change" : "Enter password"}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700 cursor-pointer">
              👑 Administrator Account
              <p className="text-xs text-gray-500 font-normal mt-1">
                Admins can access Settings and manage accounts
              </p>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {account ? 'Update Account' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Home Tab Component  
const HomeTab = ({ 
  searchTerm, 
  setSearchTerm, 
  searchType, 
  setSearchType, 
  showAutocomplete, 
  setShowAutocomplete,
  getAutocompleteResults,
  handleAutocompleteSelect,
  filteredDevices,
  filteredSoftware,
  users,
  getUserDevices,
  showBarcodeScanner,
  setShowBarcodeScanner,
  handleBarcodeScan,
  setViewingDevice,
  setViewingSoftware,
  setViewingUser
}) => {
  const autocompleteResults = getAutocompleteResults();
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Assets</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder={
                  searchType === 'device' ? 'Search by asset tag or serial number...' : 
                  searchType === 'software' ? 'Search by software name or vendor...' :
                  'Search by user name...'
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowAutocomplete(true);
                }}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            
            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {autocompleteResults.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => handleAutocompleteSelect(item)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    {searchType === 'device' ? (
                      <div>
                        <div className="font-medium text-gray-900">{item.assetTag}</div>
                        <div className="text-sm text-gray-600">{item.serialNumber} • {item.manufacturer} {item.model}</div>
                      </div>
                    ) : searchType === 'software' ? (
                      <div>
                        <div className="font-medium text-gray-900">{item.softwareName}</div>
                        <div className="text-sm text-gray-600">{item.vendor} • {item.licenseType}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.department} • {item.email}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchType('device');
                setSearchTerm('');
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                searchType === 'device' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💻 By Device
            </button>
            <button
              onClick={() => {
                setSearchType('software');
                setSearchTerm('');
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                searchType === 'software' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📦 By Software
            </button>
            <button
              onClick={() => {
                setSearchType('user');
                setSearchTerm('');
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                searchType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👤 By User
            </button>
          </div>
        </div>
        
        {/* Barcode Scan Button - Only show for device search */}
        {searchType === 'device' && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
            >
              📷 Scan Asset Tag Barcode
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && (
        searchType === 'device' ? (
          <div className="space-y-4">
            {filteredDevices.map(device => (
              <div 
                key={device.id} 
                onClick={() => setViewingDevice(device)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{device.assetTag}</h3>
                    <p className="text-gray-600">{device.manufacturer} {device.model}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      🔢 Serial Number
                    </span>
                    <p className="font-medium">{device.serialNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      👤 Assigned To
                    </span>
                    <p className="font-medium">{device.assignedTo || 'Unassigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      📅 Purchase Date
                    </span>
                    <p className="font-medium">{device.purchaseDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      🛡️ Warranty End
                    </span>
                    <p className="font-medium">{device.warrantyEnd}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 flex items-center gap-1">
                      💵 Purchase Price
                    </span>
                    <p className="font-medium">${device.purchasePrice}</p>
                  </div>
                  {device.notes && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-gray-500">Notes</span>
                      <p className="font-medium">{device.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredDevices.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                No devices found matching your search.
              </div>
            )}
          </div>
        ) : searchType === 'software' ? (
          <div className="space-y-4">
            {filteredSoftware.map(item => {
              const availableSeats = item.totalLicenses - (item.assignedUsers?.length || 0);
              const isExpiringSoon = item.renewalDate && 
                new Date(item.renewalDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => setViewingSoftware(item)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.softwareName}</h3>
                      <p className="text-gray-600">{item.vendor} • {item.licenseType}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 flex items-center gap-1">
                        🔢 Total Licenses
                      </span>
                      <p className="font-medium text-lg">{item.totalLicenses}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 flex items-center gap-1">
                        👥 Assigned
                      </span>
                      <p className="font-medium text-lg">{item.assignedUsers?.length || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 flex items-center gap-1">
                        ✅ Available
                      </span>
                      <p className={`font-medium text-lg ${availableSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {availableSeats}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 flex items-center gap-1">
                        💵 Annual Cost
                      </span>
                      <p className="font-medium text-lg">${item.annualCost}</p>
                    </div>
                  </div>

                  {item.assignedUsers && item.assignedUsers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Assigned to:</strong> {item.assignedUsers.slice(0, 3).join(', ')}
                        {item.assignedUsers.length > 3 && ` +${item.assignedUsers.length - 3} more`}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
                    💡 Click to view details
                  </div>
                </div>
              );
            })}
            {filteredSoftware.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                No software licenses found matching your search.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {users.filter(u => !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => {
              const userDevices = getUserDevices(user.name);
              return (
                <div 
                  key={user.id} 
                  onClick={() => setViewingUser(user)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                      <p className="text-gray-600">{user.department} • {user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      📦 Assigned Devices ({userDevices.length})
                    </h4>
                    {userDevices.length > 0 ? (
                      <div className="space-y-2">
                        {userDevices.map(device => (
                          <div key={device.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">{device.assetTag}</p>
                              <p className="text-sm text-gray-600">{device.manufacturer} {device.model}</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {device.serialNumber}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No devices assigned</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </>
  );
};

// Device Details Modal (Read-only view)
const DeviceDetailsModal = ({ device, onClose, onEdit, onDelete }) => {
  if (!device) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{device.assetTag}</h2>
              <p className="text-blue-100 text-lg">{device.manufacturer} {device.model}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Serial Number */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔢</span>
                <h3 className="font-semibold text-gray-700">Serial Number</h3>
              </div>
              <p className="text-lg font-mono text-gray-900">{device.serialNumber}</p>
            </div>

            {/* Assigned To */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👤</span>
                <h3 className="font-semibold text-gray-700">Assigned To</h3>
              </div>
              <p className="text-lg text-gray-900">
                {device.assignedTo || <span className="text-gray-400 italic">Unassigned</span>}
              </p>
            </div>

            {/* Purchase Date */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <h3 className="font-semibold text-gray-700">Purchase Date</h3>
              </div>
              <p className="text-lg text-gray-900">
                {new Date(device.purchaseDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Warranty End */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-semibold text-gray-700">Warranty End Date</h3>
              </div>
              <p className="text-lg text-gray-900">
                {new Date(device.warrantyEnd).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {new Date(device.warrantyEnd) < new Date() ? (
                <p className="text-sm text-red-600 font-medium mt-1">⚠️ Warranty Expired</p>
              ) : (
                <p className="text-sm text-green-600 font-medium mt-1">✓ Under Warranty</p>
              )}
            </div>

            {/* Purchase Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💵</span>
                <h3 className="font-semibold text-gray-700">Purchase Price</h3>
              </div>
              <p className="text-2xl font-bold text-green-700">${device.purchasePrice}</p>
            </div>

            {/* Asset Tag (duplicate for emphasis) */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-500200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏷️</span>
                <h3 className="font-semibold text-gray-700">Asset Tag</h3>
              </div>
              <p className="text-2xl font-bold font-mono text-blue-700">{device.assetTag}</p>
            </div>
          </div>

          {/* Notes Section */}
          {device.notes && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📝</span>
                <h3 className="font-semibold text-gray-700">Notes</h3>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{device.notes}</p>
            </div>
          )}

          {/* Device Summary Card */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Device Summary</h3>
            <p className="text-sm text-gray-600">
              <strong>{device.manufacturer} {device.model}</strong> purchased on{' '}
              <strong>{new Date(device.purchaseDate).toLocaleDateString()}</strong> for{' '}
              <strong>${device.purchasePrice}</strong>.
              {device.assignedTo ? (
                <> Currently assigned to <strong>{device.assignedTo}</strong>.</>
              ) : (
                <> Currently <strong>unassigned</strong>.</>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex gap-3">
          <button
            onClick={() => {
              onClose();
              onEdit(device);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            ✏️ Edit Device
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this device?')) {
                onDelete(device.id);
                onClose();
              }
            }}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
          >
            🗑️ Delete
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Software Details Modal (Read-only view)
const SoftwareDetailsModal = ({ software, onClose, onEdit, onDelete }) => {
  if (!software) return null;

  const availableSeats = software.totalLicenses - (software.assignedUsers?.length || 0);
  const isExpired = software.renewalDate && new Date(software.renewalDate) < new Date();
  const isExpiringSoon = software.renewalDate && 
    new Date(software.renewalDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{software.softwareName}</h2>
              <p className="text-purple-100 text-lg">{software.vendor} • {software.licenseType}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* License Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-500200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔢</span>
                <h3 className="font-semibold text-gray-700">Total Licenses</h3>
              </div>
              <p className="text-3xl font-bold text-blue-700">{software.totalLicenses}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👥</span>
                <h3 className="font-semibold text-gray-700">Assigned</h3>
              </div>
              <p className="text-3xl font-bold text-green-700">{software.assignedUsers?.length || 0}</p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${availableSeats === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-semibold text-gray-700">Available</h3>
              </div>
              <p className={`text-3xl font-bold ${availableSeats === 0 ? 'text-red-700' : 'text-green-700'}`}>
                {availableSeats}
              </p>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💵</span>
                <h3 className="font-semibold text-gray-700">Annual Cost</h3>
              </div>
              <p className="text-2xl font-bold text-green-700">${software.annualCost}</p>
              <p className="text-sm text-gray-600 mt-1">
                Per seat: ${(parseFloat(software.annualCost) / software.totalLicenses).toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📅</span>
                <h3 className="font-semibold text-gray-700">Purchase Date</h3>
              </div>
              <p className="text-lg text-gray-900">
                {new Date(software.purchaseDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${isExpired ? 'bg-red-50' : isExpiringSoon ? 'bg-orange-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔄</span>
                <h3 className="font-semibold text-gray-700">Renewal Date</h3>
              </div>
              <p className="text-lg text-gray-900">
                {new Date(software.renewalDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {isExpired && <p className="text-sm text-red-600 font-medium mt-1">⚠️ License Expired</p>}
              {!isExpired && isExpiringSoon && <p className="text-sm text-orange-600 font-medium mt-1">⚠️ Renewing Soon</p>}
              {!isExpired && !isExpiringSoon && <p className="text-sm text-green-600 font-medium mt-1">✓ Active</p>}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📦</span>
                <h3 className="font-semibold text-gray-700">License Type</h3>
              </div>
              <p className="text-lg text-gray-900">{software.licenseType}</p>
            </div>
          </div>

          {/* License Key */}
          {software.licenseKey && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔑</span>
                <h3 className="font-semibold text-gray-700">License Key</h3>
              </div>
              <p className="font-mono text-sm text-gray-800 break-all">{software.licenseKey}</p>
            </div>
          )}

          {/* Assigned Users */}
          <div className="bg-blue-50 border-2 border-blue-500200 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👥</span>
              <h3 className="font-semibold text-gray-700">
                Assigned Users ({software.assignedUsers?.length || 0}/{software.totalLicenses})
              </h3>
            </div>
            {software.assignedUsers && software.assignedUsers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {software.assignedUsers.map((user, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded border border-blue-500200">
                    <p className="text-sm font-medium text-gray-800">{user}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No users assigned</p>
            )}
          </div>

          {/* Notes */}
          {software.notes && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📝</span>
                <h3 className="font-semibold text-gray-700">Notes</h3>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{software.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex gap-3">
          <button
            onClick={() => {
              onClose();
              onEdit(software);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            ✏️ Edit License
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this software license?')) {
                onDelete(software.id);
                onClose();
              }
            }}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
          >
            🗑️ Delete
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Software Modal (Add/Edit)
const SoftwareModal = ({ software, users, onSave, onClose }) => {
  const [formData, setFormData] = useState(software || {
    softwareName: '',
    vendor: '',
    licenseType: '',
    totalLicenses: 1,
    annualCost: '',
    purchaseDate: '',
    renewalDate: '',
    licenseKey: '',
    assignedUsers: [],
    notes: ''
  });
  
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleUserToggle = (userName) => {
    const currentUsers = formData.assignedUsers || [];
    if (currentUsers.includes(userName)) {
      setFormData({
        ...formData,
        assignedUsers: currentUsers.filter(u => u !== userName)
      });
    } else {
      if (currentUsers.length < formData.totalLicenses) {
        setFormData({
          ...formData,
          assignedUsers: [...currentUsers, userName]
        });
        // Clear search bar after selection
        setUserSearchTerm('');
      } else {
        alert(`Cannot assign more than ${formData.totalLicenses} licenses`);
      }
    }
  };

  const availableSeats = formData.totalLicenses - (formData.assignedUsers?.length || 0);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!userSearchTerm) return true;
    const searchLower = userSearchTerm.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) ||
           user.department.toLowerCase().includes(searchLower) ||
           user.email.toLowerCase().includes(searchLower);
  }).sort((a, b) => {
    // Sort: assigned users first, then alphabetically by name
    const aAssigned = (formData.assignedUsers || []).includes(a.name);
    const bAssigned = (formData.assignedUsers || []).includes(b.name);
    
    if (aAssigned && !bAssigned) return -1;
    if (!aAssigned && bAssigned) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {software ? 'Edit Software License' : 'Add New Software License'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Software Name *</label>
              <input
                type="text"
                required
                value={formData.softwareName}
                onChange={(e) => setFormData({ ...formData, softwareName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Adobe Creative Cloud"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Adobe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
              <select
                value={formData.licenseType}
                onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Type</option>
                <option value="Subscription">Subscription</option>
                <option value="Perpetual">Perpetual</option>
                <option value="Site License">Site License</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Licenses</label>
              <input
                type="number"
                min="1"
                value={formData.totalLicenses}
                onChange={(e) => setFormData({ ...formData, totalLicenses: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Financial Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Cost</label>
              <input
                type="number"
                step="0.01"
                value={formData.annualCost}
                onChange={(e) => setFormData({ ...formData, annualCost: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="1299.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Date</label>
              <input
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* License Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Key</label>
            <input
              type="text"
              value={formData.licenseKey}
              onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="XXXX-XXXX-XXXX-XXXX"
            />
          </div>

          {/* User Assignment */}
          <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">
                Assign Users ({formData.assignedUsers?.length || 0}/{formData.totalLicenses})
              </h3>
              <span className={`text-sm font-medium ${availableSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
                {availableSeats} available
              </span>
            </div>
            
            {/* User Search Bar */}
            <div className="mb-3">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search users by name, department, or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {filteredUsers.map(user => {
                const isAssigned = (formData.assignedUsers || []).includes(user.name);
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-2 p-3 rounded border-2 cursor-pointer transition ${
                      isAssigned 
                        ? 'bg-purple-100 border-purple-400' 
                        : 'bg-white border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={() => handleUserToggle(user.name)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.department}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            {filteredUsers.length === 0 && userSearchTerm && (
              <p className="text-sm text-gray-500 italic text-center py-4">No users match your search</p>
            )}
            {users.length === 0 && (
              <p className="text-sm text-gray-500 italic">No users available. Add users first in the Users tab.</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Additional notes about this software..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {software ? 'Update License' : 'Add License'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeviceModal = ({ device, users, onSave, onClose, initialAssetTag }) => {
  const [formData, setFormData] = useState(device || {
    assetTag: initialAssetTag || '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    purchaseDate: '',
    warrantyEnd: '',
    purchasePrice: '',
    assignedTo: '',
    notes: ''
  });
  
  const [showAssetTagScanner, setShowAssetTagScanner] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleAssetTagScan = (scannedCode) => {
    setFormData({ ...formData, assetTag: scannedCode });
    setShowAssetTagScanner(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {device ? 'Edit Device' : 'Add New Device'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Tag *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.assetTag}
                  onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="DPA-LAP-001"
                />
                <button
                  type="button"
                  onClick={() => setShowAssetTagScanner(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 transition"
                  title="Scan barcode"
                >
                  📷
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="SN123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Dell, HP, Apple..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Latitude 7420"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty End Date</label>
              <input
                type="date"
                value={formData.warrantyEnd}
                onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1299.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Additional notes about this device..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {device ? 'Update Device' : 'Add Device'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      {/* Asset Tag Scanner */}
      {showAssetTagScanner && (
        <BarcodeScanner
          onScan={handleAssetTagScan}
          onClose={() => setShowAssetTagScanner(false)}
          title="Scan Asset Tag Barcode"
        />
      )}
    </div>
  );
};

// User Details Modal (read-only view with devices and software)
const UserDetailsModal = ({ user, devices, software, onEdit, onDelete, onClose }) => {
  if (!user) return null;
  
  // Find devices assigned to this user
  const userDevices = devices.filter(d => d.assignedTo === user.name);
  
  // Find software licenses assigned to this user
  const userSoftware = software.filter(s => 
    s.assignedUsers && s.assignedUsers.includes(user.name)
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              {user.department && (
                <p className="text-gray-200 text-lg">{user.department}</p>
              )}
              {user.email && (
                <p className="text-gray-300 text-sm mt-1">{user.email}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assigned Devices Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              💻 Assigned Devices ({userDevices.length})
            </h3>
            {userDevices.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                No devices assigned to this user
              </div>
            ) : (
              <div className="grid gap-3">
                {userDevices.map(device => (
                  <div key={device.id} className="bg-blue-50 border border-blue-500200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-gray-900">{device.assetTag}</p>
                        <p className="text-gray-700">{device.manufacturer} {device.model}</p>
                        {device.serialNumber && (
                          <p className="text-sm text-gray-600 mt-1">Serial: {device.serialNumber}</p>
                        )}
                      </div>
                      {device.purchasePrice && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Value</p>
                          <p className="font-bold text-gray-900">${parseFloat(device.purchasePrice).toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Software Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              📦 Software Licenses ({userSoftware.length})
            </h3>
            {userSoftware.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                No software licenses assigned to this user
              </div>
            ) : (
              <div className="grid gap-3">
                {userSoftware.map(soft => (
                  <div key={soft.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-gray-900">{soft.softwareName}</p>
                        {soft.vendor && (
                          <p className="text-gray-700">{soft.vendor}</p>
                        )}
                        {soft.licenseType && (
                          <span className="inline-block mt-2 px-3 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                            {soft.licenseType}
                          </span>
                        )}
                      </div>
                      {soft.annualCost && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Annual Cost</p>
                          <p className="font-bold text-gray-900">${parseFloat(soft.annualCost).toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ✏️ Edit User
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                  onDelete(user.id);
                  onClose();
                }
              }}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              🗑️ Delete User
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState(user || {
    name: '',
    department: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Smith"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Coaching, Administration, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="jsmith@depaul.edu"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {user ? 'Update User' : 'Add User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReactDOM.render(<ITAMApp />, document.getElementById('root'));
