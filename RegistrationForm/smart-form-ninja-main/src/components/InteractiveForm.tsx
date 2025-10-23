import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface TouchedFields {
  name: boolean;
  email: boolean;
  phone: boolean;
  password: boolean;
}

const InteractiveForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return "Phone number is required";
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    if (phone.replace(/\D/g, "").length < 10) return "Phone number must be at least 10 digits";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character (!@#$%^&*)";
    return undefined;
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[!@#$%^&*]/.test(password)) strength += 10;
    return strength;
  };

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (touched.name) {
      const nameError = validateName(formData.name);
      if (nameError) newErrors.name = nameError;
    }

    if (touched.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (touched.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (touched.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    setErrors(newErrors);
  }, [formData, touched]);

  // Update password strength
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
    });

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== undefined);

    if (!hasErrors) {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your form has been submitted successfully.",
      });
      console.log("Form submitted:", formData);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-success";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
        <Card className="w-full max-w-md text-center shadow-[var(--shadow-form)] border-primary/20">
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-success/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-success animate-in zoom-in duration-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Success!</h2>
            <p className="text-muted-foreground mb-8">
              Your form has been submitted successfully. We'll get back to you soon!
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-left mb-6">
              <p className="text-sm">
                <span className="font-semibold text-foreground">Name:</span>{" "}
                <span className="text-muted-foreground">{formData.name}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                <span className="text-muted-foreground">{formData.email}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-foreground">Phone:</span>{" "}
                <span className="text-muted-foreground">{formData.phone}</span>
              </p>
            </div>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", phone: "", password: "" });
                setTouched({ name: false, email: false, phone: false, password: false });
                setErrors({});
              }}
              className="w-full bg-[var(--gradient-primary)] hover:opacity-90 transition-opacity"
            >
              Submit Another Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-md shadow-[var(--shadow-form)] border-primary/20">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Fill in your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  onBlur={handleBlur("name")}
                  className={`transition-all duration-200 shadow-[var(--shadow-input)] ${
                    touched.name && !errors.name
                      ? "border-success focus:ring-success"
                      : errors.name
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                {touched.name && !errors.name && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success animate-in fade-in duration-200" />
                )}
              </div>
              {errors.name && touched.name && (
                <div className="flex items-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  onBlur={handleBlur("email")}
                  className={`transition-all duration-200 shadow-[var(--shadow-input)] ${
                    touched.email && !errors.email
                      ? "border-success focus:ring-success"
                      : errors.email
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                {touched.email && !errors.email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success animate-in fade-in duration-200" />
                )}
              </div>
              {errors.email && touched.email && (
                <div className="flex items-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  onBlur={handleBlur("phone")}
                  className={`transition-all duration-200 shadow-[var(--shadow-input)] ${
                    touched.phone && !errors.phone
                      ? "border-success focus:ring-success"
                      : errors.phone
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                {touched.phone && !errors.phone && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success animate-in fade-in duration-200" />
                )}
              </div>
              {errors.phone && touched.phone && (
                <div className="flex items-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  onBlur={handleBlur("password")}
                  className={`pr-10 transition-all duration-200 shadow-[var(--shadow-input)] ${
                    touched.password && !errors.password
                      ? "border-success focus:ring-success"
                      : errors.password
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength < 40
                          ? "text-destructive"
                          : passwordStrength < 70
                          ? "text-yellow-600"
                          : "text-success"
                      }`}
                    >
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && touched.password && (
                <div className="flex items-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--gradient-primary)] hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-base py-6"
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveForm;
