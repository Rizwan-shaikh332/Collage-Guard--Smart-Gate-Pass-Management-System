import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { Camera, ShieldCheck, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AlumniRegistration() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [step, setStep] = useState("form"); // 'form', 'camera', 'success'
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    secondary_email: "",
    mobile_no: "",
    secondary_phone: "",
    enrollment_number: "",
    degree: "",
    department: "",
    address: "",
    designation: "",
    company: "",
    year_of_passing: "",
    year_of_joining: "",
    sub_institute: "",
    linkedin_profile: "",
    whom_to_meet: "", // 'faculty', 'student', 'visitor'
    selected_person_id: "",
    selected_person_name: "",
    selected_person_mobile: "",
  });

  const [photoBase64, setPhotoBase64] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Handle search for faculty/students
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let endpoint = "";
      if (formData.whom_to_meet === "faculty") {
        endpoint = `/search/faculty?query=${encodeURIComponent(query)}`;
      } else if (formData.whom_to_meet === "student") {
        endpoint = `/search/students?query=${encodeURIComponent(query)}`;
      }

      if (endpoint) {
        const response = await axios.get(`${BACKEND_URL}/api${endpoint}`);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a person from search results
  const handleSelectPerson = (person) => {
    const personId = person.faculty_id || person.reg_no || "";
    const personName = person.name || "";
    const personMobile = person.mobile_no || "";

    setSelectedPerson(person);
    setFormData({
      ...formData,
      selected_person_id: personId,
      selected_person_name: personName,
      selected_person_mobile: personMobile,
    });
    setSearchResults([]);
    setSearchQuery("");
    toast.success(`Selected: ${personName}`);
  };

  // Handle clearing selected person
  const handleClearSelected = () => {
    setSelectedPerson(null);
    setFormData({
      ...formData,
      selected_person_id: "",
      selected_person_name: "",
      selected_person_mobile: "",
    });
    setSearchQuery("");
  };

  // Mask phone number - show only last 4 digits
  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    const phoneStr = phone.toString();
    if (phoneStr.length <= 4) return phoneStr;
    return "XXXX" + phoneStr.slice(-4);
  };

  const capture = useCallback(() => {
    // Countdown
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotoBase64(imageSrc);
        setStep("form");
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [webcamRef]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleWhomToMeetChange = (value) => {
    setFormData({
      ...formData,
      whom_to_meet: value,
      selected_person_id: "",
      selected_person_name: "",
      selected_person_mobile: "",
    });
    setSelectedPerson(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Validate required fields
  const validateForm = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "mobile_no",
      "enrollment_number",
      "degree",
      "department",
      "address",
      "designation",
      "company",
      "year_of_passing",
      "year_of_joining",
      "sub_institute",
      "whom_to_meet",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/_/g, " ")}`);
        return false;
      }
    }

    if (
      (formData.whom_to_meet === "faculty" ||
        formData.whom_to_meet === "student") &&
      !selectedPerson
    ) {
      toast.error(`Please select a ${formData.whom_to_meet}`);
      return false;
    }

    if (!photoBase64) {
      toast.error("Please capture a photo");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/alumni`, {
        ...formData,
        photo_base64: photoBase64,
      });

      setRegistrationData(response.data);
      setStep("success");
      toast.success("Registration successful! QR code sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800"
      data-testid="alumni-registration"
    >
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldCheck className="w-6 sm:w-8 h-6 sm:h-8 text-slate-900 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Alumni Registration
            </h1>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 text-sm sm:text-base"
            data-testid="back-to-home"
          >
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        {/* Form Step */}
        {step === "form" && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-8 tracking-tight">
              Register as Alumni
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Name Section */}
              <div className="space-y-4 p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-first-name"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="middle_name"
                      className="text-sm font-medium"
                    >
                      Middle Name
                    </Label>
                    <Input
                      id="middle_name"
                      type="text"
                      placeholder="Michael"
                      value={formData.middle_name}
                      onChange={(e) =>
                        handleInputChange("middle_name", e.target.value)
                      }
                      className="mt-2 h-10"
                      data-testid="alumni-middle-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_name" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-last-name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Primary Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-email"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="secondary_email"
                      className="text-sm font-medium"
                    >
                      Secondary Email
                    </Label>
                    <Input
                      id="secondary_email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.secondary_email}
                      onChange={(e) =>
                        handleInputChange("secondary_email", e.target.value)
                      }
                      className="mt-2 h-10"
                      data-testid="alumni-secondary-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobile_no" className="text-sm font-medium">
                      Primary Mobile Number *
                    </Label>
                    <Input
                      id="mobile_no"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.mobile_no}
                      onChange={(e) =>
                        handleInputChange("mobile_no", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-mobile"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="secondary_phone"
                      className="text-sm font-medium"
                    >
                      Secondary Mobile
                    </Label>
                    <Input
                      id="secondary_phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.secondary_phone}
                      onChange={(e) =>
                        handleInputChange("secondary_phone", e.target.value)
                      }
                      className="mt-2 h-10"
                      data-testid="alumni-secondary-phone"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-4 p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Academic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="enrollment_number"
                      className="text-sm font-medium"
                    >
                      Enrollment Number / GRN *
                    </Label>
                    <Input
                      id="enrollment_number"
                      type="text"
                      placeholder="211234567"
                      value={formData.enrollment_number}
                      onChange={(e) =>
                        handleInputChange("enrollment_number", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-enrollment"
                    />
                  </div>

                  <div>
                    <Label htmlFor="degree" className="text-sm font-medium">
                      Degree *
                    </Label>
                    <Input
                      id="degree"
                      type="text"
                      placeholder="B.Tech"
                      value={formData.degree}
                      onChange={(e) =>
                        handleInputChange("degree", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-degree"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="Computer Science"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-department"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="sub_institute"
                      className="text-sm font-medium"
                    >
                      Sub-Institute *
                    </Label>
                    <Input
                      id="sub_institute"
                      type="text"
                      placeholder="PICT Pune"
                      value={formData.sub_institute}
                      onChange={(e) =>
                        handleInputChange("sub_institute", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-sub-institute"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="year_of_joining"
                      className="text-sm font-medium"
                    >
                      Year of Joining *
                    </Label>
                    <Input
                      id="year_of_joining"
                      type="number"
                      placeholder="2019"
                      value={formData.year_of_joining}
                      onChange={(e) =>
                        handleInputChange("year_of_joining", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-year-joining"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="year_of_passing"
                      className="text-sm font-medium"
                    >
                      Year of Passing *
                    </Label>
                    <Input
                      id="year_of_passing"
                      type="number"
                      placeholder="2023"
                      value={formData.year_of_passing}
                      onChange={(e) =>
                        handleInputChange("year_of_passing", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-year-passing"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4 p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company" className="text-sm font-medium">
                      Current Company *
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Microsoft"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-company"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="designation"
                      className="text-sm font-medium"
                    >
                      Designation *
                    </Label>
                    <Input
                      id="designation"
                      type="text"
                      placeholder="Senior Software Engineer"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-designation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      Current Address *
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Bangalore, India"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="alumni-address"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="linkedin_profile"
                      className="text-sm font-medium"
                    >
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin_profile"
                      type="url"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={formData.linkedin_profile}
                      onChange={(e) =>
                        handleInputChange("linkedin_profile", e.target.value)
                      }
                      className="mt-2 h-10"
                      data-testid="alumni-linkedin"
                    />
                  </div>
                </div>
              </div>

              {/* Whom to Meet Section */}
              <div className="space-y-4 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Meet With
                </h3>

                <div>
                  <Label htmlFor="whom_to_meet" className="text-sm font-medium">
                    Who do you want to meet? *
                  </Label>
                  <select
                    id="whom_to_meet"
                    value={formData.whom_to_meet}
                    onChange={(e) => handleWhomToMeetChange(e.target.value)}
                    required
                    className="mt-2 w-full h-10 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-900 focus:border-slate-900"
                    data-testid="alumni-whom-to-meet"
                  >
                    <option value="">-- Select --</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="student">Student</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>

                {/* Search Section */}
                {(formData.whom_to_meet === "faculty" ||
                  formData.whom_to_meet === "student") && (
                  <div className="space-y-3 mt-4">
                    <Label htmlFor="search" className="text-sm font-medium">
                      Search by Name, Mobile, or{" "}
                      {formData.whom_to_meet === "faculty"
                        ? "Faculty ID"
                        : "GRN"}{" "}
                      *
                    </Label>
                    <div className="relative">
                      <Input
                        id="search"
                        type="text"
                        placeholder={`Search ${formData.whom_to_meet}...`}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="mt-2 h-10 pl-10"
                        data-testid="alumni-search-person"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
                    </div>

                    {selectedPerson && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-emerald-900 text-base">
                            {selectedPerson.name}
                          </p>
                          <p className="text-emerald-700 font-medium mt-1">
                            📱 {maskPhoneNumber(selectedPerson.mobile_no)}
                          </p>
                          {selectedPerson.faculty_id && (
                            <p className="text-sm text-emerald-600 mt-1">
                              Faculty ID: {selectedPerson.faculty_id}
                            </p>
                          )}
                          {selectedPerson.reg_no && (
                            <p className="text-sm text-emerald-600 mt-1">
                              GRN: {selectedPerson.reg_no}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleClearSelected}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {searchQuery &&
                      !selectedPerson &&
                      searchResults.length > 0 && (
                        <div className="border border-slate-300 rounded-lg bg-white shadow-lg max-h-96 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectPerson(result)}
                              className="w-full p-4 hover:bg-blue-50 text-left border-b border-slate-100 last:border-b-0 transition-colors"
                              data-testid="alumni-search-result"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-900 text-base">
                                    {result.name}
                                  </p>
                                  <p className="text-sm font-medium text-blue-600 mt-1">
                                    📱 {maskPhoneNumber(result.mobile_no)}
                                  </p>
                                </div>
                              </div>
                              {result.faculty_id && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Faculty ID: {result.faculty_id}
                                </p>
                              )}
                              {result.reg_no && (
                                <p className="text-xs text-slate-500 mt-2">
                                  GRN: {result.reg_no}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                    {searchQuery && !selectedPerson && isSearching && (
                      <div className="text-center p-4 text-slate-600">
                        Searching...
                      </div>
                    )}

                    {searchQuery &&
                      !selectedPerson &&
                      !isSearching &&
                      searchResults.length === 0 && (
                        <div className="text-center p-4 text-slate-600">
                          No {formData.whom_to_meet}s found. Try another search.
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Photo Capture */}
              <div className="space-y-4 p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
                <Label htmlFor="photo" className="text-lg font-semibold">
                  Photo (Selfie) *
                </Label>
                <div className="mt-4">
                  {!photoBase64 ? (
                    <Button
                      type="button"
                      onClick={() => setStep("camera")}
                      variant="secondary"
                      className="w-full h-12 text-base"
                      data-testid="capture-photo-btn"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={photoBase64}
                        alt="Captured"
                        className="w-full max-w-sm mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => setStep("camera")}
                        variant="secondary"
                        className="w-full h-12 text-base"
                        data-testid="retake-photo-btn"
                      >
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-semibold rounded-lg transition-colors"
                disabled={loading}
                data-testid="submit-alumni"
              >
                {loading ? "Registering..." : "Register & Get QR Code"}
              </Button>
            </form>
          </div>
        )}

        {/* Camera Step */}
        {step === "camera" && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 tracking-tight text-center">
              Take a Selfie
            </h2>
            <div className="relative mb-6 rounded-lg overflow-hidden bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full qr-scanner-video"
                mirrored
                data-testid="webcam"
              />
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <span className="text-9xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 sm:w-64 h-48 sm:h-64 border-2 border-dashed border-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setStep("form")}
                variant="secondary"
                className="flex-1 h-12 text-base"
                data-testid="cancel-camera"
              >
                Cancel
              </Button>
              <Button
                onClick={capture}
                className="flex-1 bg-slate-900 hover:bg-slate-800 h-12 text-base"
                disabled={countdown !== null}
                data-testid="capture-btn"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && registrationData && (
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
            data-testid="registration-success"
          >
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-4 tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-slate-600 mb-8 text-base">
              Your gate pass has been generated and sent to your email.
            </p>

            {/* Alumni Meeting Info Card */}
            {formData.whom_to_meet && (
              <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 uppercase tracking-wider font-semibold mb-3">
                  You are meeting with
                </p>
                <div className="space-y-2">
                  <p className="text-xl sm:text-2xl font-bold text-green-900">
                    {formData.selected_person_name || "Not Specified"}
                  </p>
                  <p className="text-green-700">
                    <strong>Type:</strong>{" "}
                    {formData.whom_to_meet.charAt(0).toUpperCase() +
                      formData.whom_to_meet.slice(1)}
                  </p>
                  {formData.selected_person_mobile && (
                    <p className="text-green-700">
                      <strong>Contact:</strong>{" "}
                      {formData.selected_person_mobile}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div
              className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 inline-block mb-6"
              data-testid="alumni-qr"
            >
              <QRCodeSVG value={registrationData.token} size={200} level="H" />
            </div>

            <div className="mb-6">
              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider mb-1">
                Valid Until
              </p>
              <p
                className="text-lg sm:text-xl font-semibold text-slate-900 font-mono"
                data-testid="alumni-valid-till"
              >
                {new Date(registrationData.valid_till).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200 mb-6">
              <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                Please check your email for the QR code. You can also screenshot
                this page. This pass is valid for 24 hours only.
              </p>
            </div>

            <Button
              onClick={() => navigate("/")}
              className="bg-slate-900 hover:bg-slate-800 h-12 text-base font-semibold"
              data-testid="back-home"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
