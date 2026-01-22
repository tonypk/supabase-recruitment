'use client'

import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [email, setEmail] = useState('')
  const [candidate, setCandidate] = useState('')
  const [jobId, setJobId] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function login() {
    if (!email) return alert('Please enter your email')

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    alert('Login link sent. Please check your email.')
  }

  async function upload() {
    if (!file) return alert('No file selected')
    if (!candidate || !jobId) return alert('Candidate name and Job ID are required')

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return alert('Not logged in')

    const ext = file.name.split('.').pop()
    const path = `${jobId}/${crypto.randomUUID()}.${ext}`

    await supabase.storage.from('resumes').upload(path, file)

    await supabase.from('resumes').insert({
      candidate_name: candidate,
      job_id: jobId,
      file_path: path,
      uploader_id: userData.user.id
    })

    alert('Resume uploaded')
  }

  return (
    <main>
      <h1>Recruitment Tracking System (MVP)</h1>

      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={login}>Send Login Link</button>

      <h2>Upload Resume</h2>
      <input placeholder="Candidate Name" value={candidate} onChange={e => setCandidate(e.target.value)} /><br />
      <input placeholder="Job ID (UUID)" value={jobId} onChange={e => setJobId(e.target.value)} /><br />
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} /><br />
      <button onClick={upload}>Upload</button>
    </main>
  )
}