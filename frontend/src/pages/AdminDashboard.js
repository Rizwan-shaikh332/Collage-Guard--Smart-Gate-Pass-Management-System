import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, LogOut, Users, Calendar, ScanLine, School, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    fetchStudents();
    fetchFaculty();
    fetchEvents();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/students`);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/faculty`);
      setFaculty(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PICT Guard Admin</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="stat-visitors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Visitors Today</span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.visitors_today || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="stat-students">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Students</span>
              <School className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total_students || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="stat-faculty">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Faculty</span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total_faculty || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6" data-testid="stat-events">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Events</span>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total_events || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="students" data-testid="tab-students">Students</TabsTrigger>
            <TabsTrigger value="faculty" data-testid="tab-faculty">Faculty</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="visitors" data-testid="tab-visitors">Visitors</TabsTrigger>
            <TabsTrigger value="alumni" data-testid="tab-alumni">Alumni</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentsTab students={students} fetchStudents={fetchStudents} />
          </TabsContent>

          <TabsContent value="faculty">
            <FacultyTab faculty={faculty} fetchFaculty={fetchFaculty} />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab events={events} fetchEvents={fetchEvents} students={students} />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorsTab />
          </TabsContent>

          <TabsContent value="alumni">
            <AlumniTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Students Tab Component
function StudentsTab({ students, fetchStudents }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    reg_no: '', name: '', email: '', mobile_no: '', dob: '', current_year: 1
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/students`, formData);
      toast.success('Student added successfully!');
      setIsDialogOpen(false);
      fetchStudents();
      setFormData({ reg_no: '', name: '', email: '', mobile_no: '', dob: '', current_year: 1 });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setLoading(true);
    const formDataBulk = new FormData();
    formDataBulk.append('file', bulkFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/students/bulk`, formDataBulk);
      toast.success(`${response.data.created} students added!`);
      if (response.data.errors.length > 0) {
        toast.warning(`${response.data.errors.length} errors occurred`);
      }
      fetchStudents();
      setBulkFile(null);
    } catch (error) {
      toast.error('Failed to upload students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Student Management</h3>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800" data-testid="add-student-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" data-testid="add-student-dialog">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Registration Number</Label>
                  <Input value={formData.reg_no} onChange={(e) => setFormData({...formData, reg_no: e.target.value})} required data-testid="student-reg-no" />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required data-testid="student-name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required data-testid="student-email" />
                </div>
                <div>
                  <Label>Mobile Number</Label>
                  <Input value={formData.mobile_no} onChange={(e) => setFormData({...formData, mobile_no: e.target.value})} required data-testid="student-mobile" />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required data-testid="student-dob" />
                </div>
                <div>
                  <Label>Current Year</Label>
                  <Input type="number" min="1" max="4" value={formData.current_year} onChange={(e) => setFormData({...formData, current_year: parseInt(e.target.value)})} required data-testid="student-year" />
                </div>
                <Button type="submit" className="w-full" disabled={loading} data-testid="submit-student">
                  {loading ? 'Adding...' : 'Add Student'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Upload */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <Label>Bulk Upload (Excel)</Label>
        <div className="flex gap-2 mt-2">
          <Input type="file" accept=".xlsx,.xls" onChange={(e) => setBulkFile(e.target.files[0])} data-testid="student-bulk-file" />
          <Button onClick={handleBulkUpload} disabled={!bulkFile || loading} data-testid="student-bulk-upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Format: Reg No | Name | Email | Mobile | DOB | Current Year</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-testid="students-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Valid Till</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.reg_no}>
                <TableCell className="font-mono">{student.reg_no}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.current_year}</TableCell>
                <TableCell>{new Date(student.valid_till).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Faculty Tab Component
function FacultyTab({ faculty, fetchFaculty }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', mobile_no: '', department: '', profession: '', valid_till: ''
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/faculty`, formData);
      toast.success('Faculty added successfully!');
      setIsDialogOpen(false);
      fetchFaculty();
      setFormData({ name: '', email: '', mobile_no: '', department: '', profession: '', valid_till: '' });
    } catch (error) {
      toast.error('Failed to add faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setLoading(true);
    const formDataBulk = new FormData();
    formDataBulk.append('file', bulkFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/faculty/bulk`, formDataBulk);
      toast.success(`${response.data.created} faculty added!`);
      fetchFaculty();
      setBulkFile(null);
    } catch (error) {
      toast.error('Failed to upload faculty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Faculty Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800" data-testid="add-faculty-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" data-testid="add-faculty-dialog">
            <DialogHeader>
              <DialogTitle>Add New Faculty</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required data-testid="faculty-name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required data-testid="faculty-email" />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input value={formData.mobile_no} onChange={(e) => setFormData({...formData, mobile_no: e.target.value})} required data-testid="faculty-mobile" />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required data-testid="faculty-department" />
              </div>
              <div>
                <Label>Profession/Position</Label>
                <Input value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} required data-testid="faculty-profession" />
              </div>
              <div>
                <Label>Valid Till Date</Label>
                <Input type="date" value={formData.valid_till} onChange={(e) => setFormData({...formData, valid_till: e.target.value})} required data-testid="faculty-valid-till" />
              </div>
              <Button type="submit" className="w-full" disabled={loading} data-testid="submit-faculty">
                {loading ? 'Adding...' : 'Add Faculty'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bulk Upload */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <Label>Bulk Upload (Excel)</Label>
        <div className="flex gap-2 mt-2">
          <Input type="file" accept=".xlsx,.xls" onChange={(e) => setBulkFile(e.target.files[0])} data-testid="faculty-bulk-file" />
          <Button onClick={handleBulkUpload} disabled={!bulkFile || loading} data-testid="faculty-bulk-upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Format: Name | Email | Mobile | Department | Profession | Valid Till</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-testid="faculty-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faculty ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Valid Till</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map((fac) => (
              <TableRow key={fac.faculty_id}>
                <TableCell className="font-mono">{fac.faculty_id}</TableCell>
                <TableCell>{fac.name}</TableCell>
                <TableCell>{fac.department}</TableCell>
                <TableCell>{fac.profession}</TableCell>
                <TableCell>{new Date(fac.valid_till).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Events Tab Component
function EventsTab({ events, fetchEvents, students }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '', event_type: '', date_from: '', date_to: '', description: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStudents, setEventStudents] = useState([]);
  const [studentRegNo, setStudentRegNo] = useState('');
  const [manualEntry, setManualEntry] = useState(false);
  const [manualStudentData, setManualStudentData] = useState({
    reg_no: '', name: '', email: '', mobile_no: ''
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/events`, formData);
      toast.success('Event created successfully!');
      setIsDialogOpen(false);
      fetchEvents();
      setFormData({ event_name: '', event_type: '', date_from: '', date_to: '', description: '' });
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStudents = async (eventId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events/${eventId}/students`);
      setEventStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedEvent) return;
    
    if (manualEntry) {
      // Manual entry for external students
      if (!manualStudentData.reg_no || !manualStudentData.name || !manualStudentData.email || !manualStudentData.mobile_no) {
        toast.error('Please fill all fields for manual entry');
        return;
      }
      setLoading(true);
      try {
        await axios.post(`${BACKEND_URL}/api/events/students/manual`, {
          event_id: selectedEvent.event_id,
          ...manualStudentData
        });
        toast.success('External student added to event!');
        fetchEventStudents(selectedEvent.event_id);
        setManualStudentData({ reg_no: '', name: '', email: '', mobile_no: '' });
        setManualEntry(false);
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to add student');
      } finally {
        setLoading(false);
      }
    } else {
      // Existing PICT student
      if (!studentRegNo) return;
      setLoading(true);
      try {
        await axios.post(`${BACKEND_URL}/api/events/students`, {
          event_id: selectedEvent.event_id,
          reg_no: studentRegNo
        });
        toast.success('Student added to event and email sent!');
        fetchEventStudents(selectedEvent.event_id);
        setStudentRegNo('');
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Student not found. Try manual entry for external students.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkAddStudents = async () => {
    if (!selectedEvent || !bulkFile) return;
    setLoading(true);
    const formDataBulk = new FormData();
    formDataBulk.append('event_id', selectedEvent.event_id);
    formDataBulk.append('file', bulkFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/events/students/bulk`, formDataBulk);
      toast.success(`${response.data.added} students added!`);
      fetchEventStudents(selectedEvent.event_id);
      setBulkFile(null);
    } catch (error) {
      toast.error('Failed to add students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Event Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800" data-testid="add-event-btn">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" data-testid="add-event-dialog">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Event Name</Label>
                <Input value={formData.event_name} onChange={(e) => setFormData({...formData, event_name: e.target.value})} required data-testid="event-name" />
              </div>
              <div>
                <Label>Event Type</Label>
                <Input value={formData.event_type} onChange={(e) => setFormData({...formData, event_type: e.target.value})} required data-testid="event-type" />
              </div>
              <div>
                <Label>Date From</Label>
                <Input type="date" value={formData.date_from} onChange={(e) => setFormData({...formData, date_from: e.target.value})} required data-testid="event-date-from" />
              </div>
              <div>
                <Label>Date To</Label>
                <Input type="date" value={formData.date_to} onChange={(e) => setFormData({...formData, date_to: e.target.value})} required data-testid="event-date-to" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required data-testid="event-description" />
              </div>
              <Button type="submit" className="w-full" disabled={loading} data-testid="submit-event">
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-4" data-testid="events-list">
        {events.map((event) => (
          <div key={event.event_id} className="border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-lg text-slate-900">{event.event_name}</h4>
                <p className="text-sm text-slate-500">{event.event_type}</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => {
                  setSelectedEvent(event);
                  fetchEventStudents(event.event_id);
                }}
                data-testid={`view-event-students-${event.event_id}`}
              >
                View Students
              </Button>
            </div>
            <p className="text-sm text-slate-600 mb-2">{event.description}</p>
            <p className="text-sm text-slate-500">
              {new Date(event.date_from).toLocaleDateString()} - {new Date(event.date_to).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Event Students Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-3xl" data-testid="event-students-dialog">
            <DialogHeader>
              <DialogTitle>Students for {selectedEvent.event_name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Toggle between existing and manual entry */}
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={!manualEntry ? "default" : "secondary"}
                  onClick={() => setManualEntry(false)}
                  data-testid="toggle-existing-student"
                >
                  PICT Student
                </Button>
                <Button 
                  variant={manualEntry ? "default" : "secondary"}
                  onClick={() => setManualEntry(true)}
                  data-testid="toggle-manual-entry"
                >
                  External Student
                </Button>
              </div>

              {/* Add Student - Existing or Manual */}
              {!manualEntry ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter PICT student reg no" 
                    value={studentRegNo} 
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    data-testid="event-student-reg-no"
                  />
                  <Button onClick={handleAddStudent} disabled={loading} data-testid="add-student-to-event">
                    Add
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">Add External College Student</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      placeholder="Reg No (e.g., EXT001)" 
                      value={manualStudentData.reg_no} 
                      onChange={(e) => setManualStudentData({...manualStudentData, reg_no: e.target.value})}
                      data-testid="manual-reg-no"
                    />
                    <Input 
                      placeholder="Full Name" 
                      value={manualStudentData.name} 
                      onChange={(e) => setManualStudentData({...manualStudentData, name: e.target.value})}
                      data-testid="manual-name"
                    />
                    <Input 
                      placeholder="Email" 
                      type="email"
                      value={manualStudentData.email} 
                      onChange={(e) => setManualStudentData({...manualStudentData, email: e.target.value})}
                      data-testid="manual-email"
                    />
                    <Input 
                      placeholder="Mobile" 
                      value={manualStudentData.mobile_no} 
                      onChange={(e) => setManualStudentData({...manualStudentData, mobile_no: e.target.value})}
                      data-testid="manual-mobile"
                    />
                  </div>
                  <Button onClick={handleAddStudent} disabled={loading} className="w-full" data-testid="add-manual-student">
                    Add External Student
                  </Button>
                </div>
              )}

              {/* Bulk Add */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <Label>Bulk Add Students (Excel)</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="file" accept=".xlsx,.xls" onChange={(e) => setBulkFile(e.target.files[0])} data-testid="event-bulk-file" />
                  <Button onClick={handleBulkAddStudents} disabled={!bulkFile || loading} data-testid="event-bulk-upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Format: Reg No | Name (optional) | Email (optional) | Mobile (optional)<br/>
                  <strong>For PICT students:</strong> Only Reg No needed<br/>
                  <strong>For external students:</strong> Provide all 4 fields
                </p>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto" data-testid="event-students-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Valid From - To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventStudents.map((student) => (
                      <TableRow key={student.token}>
                        <TableCell className="font-mono">{student.reg_no}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {new Date(student.valid_from).toLocaleDateString()} - {new Date(student.valid_to).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}