'use client';

import { useState, useEffect} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from "next/navigation";
import { sendVerificationCode } from '@/utils/email';
import { v4 as uuidv4 } from 'uuid';
import { database } from '@/utils/database';
import Link from "next/link";

const sections = ["Curie", "Pascal", "Newton", "Einstein"]; 

const advisers = [
  { id: 1, name: "Arial John Pagunsan Alcones", subject: null, icon: null },
  { id: 2, name: "Gladys Rufino Narciso", subject: null, icon: null },
  { id: 3, name: "Chris Constantino", subject: null, icon: null },
  { id: 4, name: "Andrea David Mendoza", subject: null, icon: null },
  { id: 5, name: "Bechayda Eleonor", subject: null, icon: null },
  { id: 6, name: "Tatz Taytayon", subject: null, icon: null },
  { id: 7, name: "Gilda Falco Gimoto", subject: null, icon: null },
  { id: 8, name: "Mrb Mavic", subject: null, icon: null },
  { id: 9, name: "Reuben John Abalayan", subject: null, icon: null },
  { id: 10, name: "Emman Jean", subject: null, icon: null },
  { id: 11, name: "Lira Sheen Azarce", subject: null, icon: null },
  { id: 12, name: "Veronica Capote Begaso", subject: null, icon: null },
  { id: 13, name: "Maru Alayon", subject: null, icon: null },
  { id: 14, name: "Arleigh Alalay", subject: null, icon: null },
  { id: 15, name: "Jojo Villaruz", subject: null, icon: null },
];

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolID, setSchoolID] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [adviser, setAdviser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
   const router = useRouter();

  useEffect(() => {
    const checkClientLogin = async () => {
      let clientUID = localStorage.getItem('clientUID');
      if (!clientUID) {
        clientUID = uuidv4();
        localStorage.setItem('clientUID', clientUID);
      }
      try {
        const dataUser = await database.getUserData(clientUID);
        if (dataUser?.id === clientUID) {
          router.push('/');
        }
      } catch (error) {}
    };
    checkClientLogin();
  }, [router]);

  const handleDobChange = (e) => {
  const selectedDate = new Date(e.target.value);
  const currentYear = new Date().getFullYear();
  const cutoffYear = currentYear - 16;
  if (selectedDate.getFullYear() > cutoffYear) {
    setError("You must be a senior highschool to continue.");
    setDob(""); 
  } else {
    setError(""); 
    setDob(e.target.value);
  }
};

const handleEmailChange = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setError(""); 

    if (newEmail) {
      const exists = await database.checkEmail(newEmail);
      if (exists) {
        setError("Email is already in use, please login instead.");
        setEmailExists(true);
      } else {
        setEmailExists(false);
      }
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      setLoading(true);
      setError('');
      const success = await sendVerificationCode(email);
      if (!success) {
        setError('Failed to send verification code. Try again.');
        setLoading(false);
        return;
      }
      setCode(success);
      setLoading(false);
    }

    if (step === 2 && otp !== code) {
      setOtpError('Invalid code, please check your email.');
      return;
    }

    if (step === 5) {
      setCreatingAccount(true);
      const clientUID = localStorage.getItem('clientUID');
      if (!clientUID) return;
      const dataUser = await database.getUserData(clientUID);
      if (dataUser?.id === clientUID) {
        router.push('/');
        return;
  }

      const userData = {
        id: clientUID,
        email,
        password,
        name,
        firstName: name.split(' ')[0],
        section,
        grade: gradeLevel,
        schoolID,
        birthday: dob,
        createdAt: new Date().toISOString(),
        adviserName: adviser.name,
        adviserIcon: adviser.icon,
        adviserSubject: adviser.subject,
        adviserUrl: undefined,
      };

      await database.loginUser(userData);
      router.push("/")
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
    
  <div className="max-w-xs text-white">
    <div className="flex justify-center">
    <img src="/logo.png" alt="leiamnash"/>
        </div>

        {creatingAccount ? (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Creating your account...</h1>
            <p className="text-gray-400 mt-2">Please wait, you will be redirected soon.</p>
          </div>
        ) : (
          <>
            {step === 1 && (
        <>
                <h1 className="text-2xl font-bold">Create your account</h1>
              <div className="mt-6 space-y-4">
                  <input type="text" className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="email" className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white" placeholder="Email" value={email} onChange={handleEmailChange} />

                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white"
                      value={dob}
                      onChange={handleDobChange}
                    />
                    {!dob && (
                      <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all">
                        Confirm your own age
                      </label>
                    )}
                  </div>

                  {error && <p className="text-red-500">{error}</p>}

                  <button onClick={nextStep} disabled={!name || !email || !dob || !!error || emailExists} className={`w-full py-3 rounded-full text-lg font-bold ${name && email && dob && !error && !emailExists ? 'bg-[#262626] hover:bg-[#0f0f0f]' : 'bg-[#0f0f0f] cursor-not-allowed' }`}
> {loading ? "Checking your email..." : "Next"}
</button>
        <p className="mt-4 text-center text-sm">
                Already have account?{" "}
                <Link href="/login" className="text-blue-400 hover:underline">
                  Login here
                </Link>
              </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="text-2xl font-bold">We sent you a code</h1>
                <div className="mt-6 space-y-4">
                <input type="text" className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white" placeholder="Verification code" value={otp} onChange={(e) => setOtp(e.target.value)} />
  {otpError && <p className="text-red-500">{otpError}</p> }
                <button onClick={nextStep} disabled={!otp} className={`w-full py-3 rounded-full text-lg font-bold ${otp ? 'bg-[#262626] hover:bg-[#0f0f0f]' : 'bg-[#0f0f0f] cursor-not-allowed'}`}>
                  Next
                </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="text-2xl font-bold">Create a password</h1>
                <div className="mt-6 space-y-4">
                <div className="relative">
                  <input type={passwordVisible ? "text" : "password"} className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                <button onClick={nextStep} disabled={!password} className={`w-full py-3 rounded-full text-lg font-bold ${password ? 'bg-[#262626] hover:bg-[#0f0f0f]' : 'bg-[#0f0f0f] cursor-not-allowed'}`}>Next</button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="text-2xl font-bold">Additional Information</h1>
                <div className="mt-6 space-y-4">
                <select className="w-full p-3 rounded bg-[#262626] border border-[#262626] text-white" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                  <option value="">Select Grade Level</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <select className="w-full p-3 rounded bg-[#262626] border border-[#262626] text-white" value={section} onChange={(e) => setSection(e.target.value)}>
                  <option value="">Select Section</option>
                  {sections.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
                </select>
                  <input type="text" className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white" placeholder="School ID" value={schoolID} onChange={(e) => setSchoolID(e.target.value)} />
                <button onClick={nextStep} disabled={!gradeLevel || !section || !schoolID} className={`w-full py-3 rounded-full text-lg font-bold ${gradeLevel && section && schoolID ? 'bg-[#262626] hover:bg-[#0f0f0f]' : 'bg-[#0f0f0f] cursor-not-allowed'}`}>Next</button>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h1 className="text-2xl font-bold">Select Your Adviser</h1>
                <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {advisers.map((adv) => (
                    <div key={adv.id} className={`p-4 border rounded text-center cursor-pointer ${adviser?.id === adv.id ? 'border-[#262626]' : ''}`} onClick={() => setAdviser(adv)}>
                      <p className="font-bold">{adv.name}</p>
                    </div>
                  ))}
                </div>
                <button onClick={nextStep} disabled={!adviser} className={`w-full py-3 rounded-full text-lg font-bold ${adviser ? 'bg-[#262626] hover:bg-[#0f0f0f]' : 'bg-[#0f0f0f] cursor-not-allowed'}`}>Create Account</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;