"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PublicSubmit() {
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, msg: "" });

        const formData = new FormData(e.currentTarget);
        const imageFile = formData.get('image') as File;

        try {
            let publicImageUrl = "";

            // 1. UPLOAD IMAGE TO SUPABASE STORAGE
            if (imageFile && imageFile.size > 0) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
                const filePath = `project-previews/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw new Error("Storage Upload Error: " + uploadError.message);

                const { data: urlData } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(filePath);

                publicImageUrl = urlData.publicUrl;
            }

            // 2. PREPARE PAYLOAD
            const rawData = Object.fromEntries(formData.entries());
            delete rawData.image;

            const payload = {
                name: rawData.name,
                category: rawData.category,
                tag: rawData.tag,
                url: rawData.live_url, // FIXED: Changed from live_url to url to match DB
                description: rawData.description,
                image: publicImageUrl,
                status: 'Active',
                is_featured: false, // Matches DB column
                customer_name: rawData.customer_name, // Matches DB
                customer_number: rawData.customer_number, // Matches DB
                customer_reviews: rawData.customer_reviews, // Matches DB
                // Note: student_name and roll_number removed as they are missing from DB schema
            };

            // 3. SEND TO API
            const res = await fetch('/api/projects/submit-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const contentType = res.headers.get("content-type");
            if (contentType && !contentType.includes("application/json")) {
                throw new Error("API Route not found. Ensure folder is named 'submit-project' inside 'api/projects'.");
            }

            if (res.ok) {
                setStatus({ type: 'success', msg: "Project created! It's now visible in Admin and Website." });
                (e.target as HTMLFormElement).reset();
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to save project");
            }
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', msg: error.message || "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '60px 5%', minHeight: '100vh', background: '#000', color: 'white', fontFamily: 'Syne, sans-serif' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Add Your Project</h1>
                <p style={{ color: '#888', marginBottom: '30px' }}>Showcase your work on BerryBuilds.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Student Info remains in UI for now but won't be saved until columns are added to DB */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitle}>Student Information</h3>
                        <div style={rowStyle}>
                            <input name="student_name" placeholder="Full Name" required style={inputStyle} />
                            <input name="roll_number" placeholder="Roll Number" required style={inputStyle} />
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={sectionTitle}>Project Details</h3>
                        <div style={rowStyle}>
                            <input name="name" placeholder="Project Name" required style={inputStyle} />
                            <input name="category" placeholder="E-commerce, AI, etc." required style={inputStyle} />
                        </div>
                        <div style={rowStyle}>
                            <input name="tag" placeholder="Tag (e.g. Next.js)" style={inputStyle} />
                            <input name="live_url" placeholder="Live Link (https://...)" style={inputStyle} />
                        </div>
                        <textarea name="description" placeholder="Short description of the project" required style={{ ...inputStyle, minHeight: '100px' }} />

                        <div style={{ marginTop: '15px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#4facfe', marginBottom: '8px', display: 'block' }}>FEATURED IMAGE</label>
                            <input type="file" name="image" accept="image/*" required style={inputStyle} />
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={{ ...sectionTitle, color: '#4facfe' }}>Client Testimonial Data</h3>
                        <div style={rowStyle}>
                            <input name="customer_name" placeholder="Client Name" style={inputStyle} />
                            <input name="customer_number" placeholder="Client Number" style={inputStyle} />
                        </div>
                        <textarea name="customer_reviews" placeholder="Client Review" style={{ ...inputStyle, minHeight: '80px' }} />
                    </div>

                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? "Creating..." : "Create Project"}
                    </button>

                    {status.msg && (
                        <div style={{ padding: '15px', borderRadius: '8px', textAlign: 'center', background: status.type === 'success' ? '#10b98122' : '#ef444422', color: status.type === 'success' ? '#10b981' : '#ef4444', border: '1px solid' }}>
                            {status.msg}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

const sectionStyle = { background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' };
const sectionTitle = { fontSize: '0.9rem', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '15px', color: '#888' };
const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '6px', color: 'white', outline: 'none' };
const buttonStyle = { padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };