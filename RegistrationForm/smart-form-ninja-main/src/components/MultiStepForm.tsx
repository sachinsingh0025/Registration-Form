import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft, Apple, Facebook } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface FormData {
  email: string;
  otp: string;
  password: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
}

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    otp: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateOTP = (otp: string): string | undefined => {
    if (!otp) return "Verification code is required";
    if (otp.length !== 5) return "Code must be 5 digits";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain a symbol";
    return undefined;
  };

  const calculatePasswordStrength = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*]/.test(password),
    };
    setPasswordRequirements(requirements);

    let strength = 0;
    if (requirements.minLength) strength += 40;
    if (requirements.hasNumber) strength += 30;
    if (requirements.hasSymbol) strength += 30;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    }
  }, [formData.password]);

  const handleEmailSubmit = () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      toast({
        title: "Validation Error",
        description: emailError,
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setStep(2);
    toast({
      title: "Code Sent!",
      description: `We've sent a verification code to ${formData.email}`,
    });
  };

  const handleOTPSubmit = () => {
    const otpError = validateOTP(formData.otp);
    if (otpError) {
      setErrors({ otp: otpError });
      toast({
        title: "Validation Error",
        description: otpError,
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handlePasswordSubmit = () => {
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors({ password: passwordError });
      toast({
        title: "Validation Error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setIsSubmitted(true);
    toast({
      title: "Success!",
      description: "Your account has been created successfully.",
    });
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Login`,
      description: `${provider} login would be integrated here.`,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <Card className="w-full max-w-md text-center shadow-[var(--shadow-form)] border-primary/20 animate-in fade-in zoom-in duration-500">
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-gradient-to-br from-primary to-accent p-4">
                <CheckCircle2 className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Your account was successfully created!
            </h2>
            <p className="text-muted-foreground mb-8">
              Welcome to Classroom! You can now start your learning journey.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                setFormData({ email: "", otp: "", password: "" });
                setErrors({});
              }}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/5 to-primary/10 relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md shadow-[var(--shadow-form)] border-primary/20 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex items-center justify-between">
            {step > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1"></div>
            <span className="text-sm text-muted-foreground font-medium">
              {step} / 3
            </span>
          </div>

          {step === 1 && (
            <>
              <CardTitle className="text-3xl font-bold">
                Welcome to Classroom
              </CardTitle>
              <CardDescription className="text-base">
                Join over 10,000 learners over the World and enjoy online education!
              </CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle className="text-3xl font-bold">
                Verify your email
              </CardTitle>
              <CardDescription className="text-base">
                We just sent a 5-digit code to {formData.email}, enter it below:
              </CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle className="text-3xl font-bold">
                Create your password
              </CardTitle>
              <CardDescription className="text-base">
                Choose a strong password to secure your account
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`transition-all duration-200 shadow-[var(--shadow-input)] ${
                    errors.email ? "border-destructive focus:ring-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleEmailSubmit}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-base py-6 text-primary-foreground"
              >
                Continue with email
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full py-6 hover:bg-accent/10"
                  onClick={() => handleSocialLogin("Apple")}
                >
                  <Apple className="mr-2 h-5 w-5" />
                  Continue with Apple
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 hover:bg-accent/10"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <Facebook className="mr-2 h-5 w-5" />
                  Continue with Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 hover:bg-accent/10"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-4">
                Already have an account?{" "}
                <button className="text-primary font-semibold hover:underline">
                  Log in
                </button>
              </p>

              <p className="text-center text-xs text-muted-foreground">
                By using Classroom, you agree to the{" "}
                <button className="text-primary hover:underline">Terms</button> and{" "}
                <button className="text-primary hover:underline">Privacy Policy</button>.
              </p>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="otp" className="text-sm font-medium text-center block">
                  Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={5}
                    value={formData.otp}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, otp: value }))
                    }
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.otp && (
                  <div className="flex items-center justify-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.otp}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleOTPSubmit}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-base py-6 text-primary-foreground"
              >
                Verify email
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Wrong email?</p>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Send to different email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className={`pr-10 transition-all duration-200 shadow-[var(--shadow-input)] ${
                      errors.password ? "border-destructive focus:ring-destructive" : ""
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
                {errors.password && (
                  <div className="flex items-center gap-1.5 text-destructive text-sm animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {formData.password && (
                <div className="space-y-3 animate-in slide-in-from-top-1 duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          passwordRequirements.minLength
                            ? "bg-success"
                            : "bg-muted border border-muted-foreground"
                        }`}
                      >
                        {passwordRequirements.minLength && (
                          <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                        )}
                      </div>
                      <span
                        className={
                          passwordRequirements.minLength
                            ? "text-success"
                            : "text-muted-foreground"
                        }
                      >
                        8 characters minimum
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          passwordRequirements.hasNumber
                            ? "bg-success"
                            : "bg-muted border border-muted-foreground"
                        }`}
                      >
                        {passwordRequirements.hasNumber && (
                          <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                        )}
                      </div>
                      <span
                        className={
                          passwordRequirements.hasNumber
                            ? "text-success"
                            : "text-muted-foreground"
                        }
                      >
                        a number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          passwordRequirements.hasSymbol
                            ? "bg-success"
                            : "bg-muted border border-muted-foreground"
                        }`}
                      >
                        {passwordRequirements.hasSymbol && (
                          <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                        )}
                      </div>
                      <span
                        className={
                          passwordRequirements.hasSymbol
                            ? "text-success"
                            : "text-muted-foreground"
                        }
                      >
                        a symbol
                      </span>
                    </div>
                  </div>

                  {passwordStrength > 0 && (
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength < 40
                            ? "bg-destructive"
                            : passwordStrength < 80
                            ? "bg-yellow-500"
                            : "bg-success"
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handlePasswordSubmit}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-base py-6 text-primary-foreground"
              >
                Continue
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By using Classroom, you agree to the{" "}
                <button className="text-primary hover:underline">Terms</button> and{" "}
                <button className="text-primary hover:underline">Privacy Policy</button>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepForm;
