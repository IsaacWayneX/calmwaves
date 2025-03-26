import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const [role, setRole] = useState("client");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
            navigate("/chat-rooms");
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { role } }
            });

            if (error) {
                alert("Signup failed: " + error.message);
                setLoading(false);
                return;
            }

            const user = data?.user;

            if (user) {
                const { data: existingUser, error: fetchError } = await supabase
                    .from("users")
                    .select("id")
                    .eq("id", user.id)
                    .single();

                if (fetchError && fetchError.code !== "PGRST116") {
                    console.error("Fetch error:", fetchError.message);
                    alert("Database error: " + fetchError.message);
                    setLoading(false);
                    return;
                }

                if (!existingUser) {
                    const { error: dbError } = await supabase.from("users").insert([
                        {
                            id: user.id,
                            email: user.email,
                            role,
                            created_at: new Date().toISOString()
                        }
                    ]);

                    if (dbError) {
                        console.error("Database Error:", dbError.message);
                        alert("Database error: " + dbError.message);
                        setLoading(false);
                        return;
                    }
                }

                alert("Signup successful! Check your email to verify your account.");
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }

            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user?.email_confirmed_at) {
                alert("Please verify your email before logging in.");
                setLoading(false);
                return;
            }

            alert("Login successful!");
            navigate("/chat-rooms");
        }

        setLoading(false);
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formSection}>
                <div style={styles.formContainer}>
                    <button onClick={() => navigate('/')} style={styles.goBackButton}>
                        ← Go Back
                    </button>
                    <h2 style={styles.title}>Begin Your Wellness Journey</h2>
                    <form onSubmit={handleAuth} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Set a secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <div style={styles.passwordHints}>
                            <span>Must be at least 8 characters</span>
                            <span>Must contain one special character</span>
                        </div>
                        {isSignUp && (
                            <select
                                onChange={(e) => setRole(e.target.value)}
                                value={role}
                                style={styles.select}
                            >
                                <option value="client">Client</option>
                                <option value="therapist">Therapist</option>
                            </select>
                        )}
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? "Processing..." : isSignUp ? "Start Your Journey" : "Sign In"}
                        </button>
                    </form>
                    <div style={styles.hireText}>
                        Are you a licensed mental health professional? <a href="#" style={styles.link}>Join our network</a>
                    </div>
                    <div style={styles.termsText}>
                        By continuing, I acknowledge that I have read and agree to the <a href="#" style={styles.link}>Terms of Service</a>, <a href="#" style={styles.link}>Privacy Policy</a>, and understand this is not a crisis service.
                    </div>
                    <button onClick={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
                        {isSignUp ? "Already have an account? Login" : "No account? Sign up"}
                    </button>
                </div>
            </div>
            <div style={styles.imageSection}>
                <div style={styles.testimonial}>
                    <p style={styles.testimonialText}>
                        Finding support here has been life-changing. The therapists are compassionate, and the platform makes mental healthcare so accessible.
                    </p>
                    <div style={styles.testimonialAuthor}>
                        Sarah M. / Recovery Journey
                    </div>
                    <div style={styles.testimonialLocation}>
                        Vancouver, Canada
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    '@media (max-width: 768px)': {
        pageContainer: {
            flexDirection: 'column'
        },
        formSection: {
            padding: '20px'
        },
        formContainer: {
            maxWidth: '100%'
        },
        title: {
            fontSize: '24px'
        },
        input: {
            fontSize: '14px',
            padding: '12px'
        },
        select: {
            fontSize: '14px',
            padding: '12px'
        },
        button: {
            padding: '14px',
            fontSize: '14px'
        },
        imageSection: {
            display: 'none'
        }
    },
    goBackButton: {
        padding: '8px 16px',
        fontSize: '16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 105, 92, 0.3)',
        '&:hover': {
            background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)',
            transform: 'translateX(-5px)'
        }
    },
    pageContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
    },
    formSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
    },
    formContainer: {
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: "'Georgia', serif",
        letterSpacing: '-1px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    input: {
        padding: '14px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '1px solid #ddd',
        outline: 'none',
        transition: 'all 0.3s ease',
        '&:focus': {
            borderColor: '#00695c',
            boxShadow: '0 0 0 2px rgba(0, 105, 92, 0.2)'
        }
    },
    passwordHints: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontSize: '12px',
        color: '#666',
        marginTop: '-8px'
    },
    select: {
        padding: '14px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '1px solid #ddd',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:focus': {
            borderColor: '#00695c',
            boxShadow: '0 0 0 2px rgba(0, 105, 92, 0.2)'
        }
    },
    button: {
        padding: '16px',
        fontSize: '16px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 15px rgba(0, 105, 92, 0.5)',
        fontWeight: 'bold',
        '&:hover': {
            background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)',
            boxShadow: '0 0 20px rgba(0, 105, 92, 0.7)'
        },
        '&:disabled': {
            opacity: 0.7,
            cursor: 'not-allowed'
        }
    },
    hireText: {
        marginTop: '24px',
        fontSize: '14px',
        color: '#444',
        textAlign: 'center',
        fontWeight: '500'
    },
    termsText: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        lineHeight: '1.6'
    },
    link: {
        color: '#00695c',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#004d40',
            textDecoration: 'underline'
        }
    },
    toggleButton: {
        marginTop: '24px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#00695c',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '8px 0',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#004d40',
            transform: 'translateX(-5px)'
        }
    },
    imageSection: {
        flex: 1,
        background: 'linear-gradient(rgba(0, 77, 64, 0.8), rgba(0, 105, 92, 0.8)), url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
    },
    testimonial: {
        color: '#fff',
        textAlign: 'center',
        maxWidth: '400px',
        padding: '20px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    testimonialText: {
        fontSize: '24px',
        lineHeight: '1.6',
        marginBottom: '24px',
        fontFamily: "'Georgia', serif"
    },
    testimonialAuthor: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px'
    },
    testimonialLocation: {
        fontSize: '16px',
        opacity: '0.9'
    }
};

export default Auth;
