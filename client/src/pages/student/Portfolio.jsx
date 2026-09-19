import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '../../api/studentApi'
import Badge, { verificationTone } from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SkillForm from '../../components/forms/SkillForm'
import { useNotify } from '../../context/NotificationContext'
import { formatDate } from '../../utils/formatters'

const emptyProject = { title: '', description: '', skills: '', githubUrl: '', liveUrl: '' }

export default function Portfolio() {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const [editingProject, setEditingProject] = useState(null)
  const portfolio = useQuery({ queryKey: ['portfolio'], queryFn: studentApi.portfolio })
  const { register: registerProfile, handleSubmit: submitProfile } = useForm()
  const { register: registerProject, handleSubmit: submitProject, reset: resetProject } = useForm({ defaultValues: emptyProject })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    queryClient.invalidateQueries({ queryKey: ['account-profile'] })
  }
  const profileSave = useMutation({
    mutationFn: studentApi.updateProfile,
    onSuccess: () => {
      refresh()
      notify.push({ type: 'success', title: 'Portfolio profile updated' })
    },
  })
  const skillAdd = useMutation({
    mutationFn: studentApi.addSkill,
    onSuccess: () => {
      refresh()
      notify.push({ type: 'success', title: 'Skill added to portfolio' })
    },
  })
  const projectSave = useMutation({
    mutationFn: (values) => editingProject ? studentApi.updateProject(editingProject.id, values) : studentApi.addProject(values),
    onSuccess: () => {
      refresh()
      resetProject(emptyProject)
      setEditingProject(null)
      notify.push({ type: 'success', title: editingProject ? 'Project updated' : 'Project added to portfolio' })
    },
  })

  if (portfolio.isLoading) return <LoadingSpinner />
  const data = portfolio.data || {}
  const profile = data.profile || {}

  const startProjectEdit = (project) => {
    setEditingProject(project)
    resetProject({ ...project, skills: project.skills?.join(', ') || '' })
  }

  const cancelProjectEdit = () => {
    setEditingProject(null)
    resetProject(emptyProject)
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-3xl bg-brand-950 p-8 text-white">
        <p className="text-brand-200">Your editable career portfolio</p>
        <h1 className="mt-2 font-display text-4xl">{profile.name}</h1>
        <p className="mt-2 text-brand-100">{profile.degree} · {profile.college} · {profile.targetRole}</p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-100/80">Keep this portfolio current as you complete projects, earn certifications, and build new evidence.</p>
      </div>

      <Card title="Profile information" action={<Badge tone="teal">Editable</Badge>}>
        <form className="grid gap-3" onSubmit={submitProfile((values) => profileSave.mutate(values))}>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" defaultValue={profile.college} placeholder="College" {...registerProfile('college')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" defaultValue={profile.degree} placeholder="Degree" {...registerProfile('degree')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" defaultValue={profile.branch} placeholder="Branch" {...registerProfile('branch')} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" defaultValue={profile.targetRole} placeholder="Target role" {...registerProfile('targetRole')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" defaultValue={profile.location} placeholder="Location" {...registerProfile('location')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" type="number" defaultValue={profile.graduationYear} placeholder="Graduation year" {...registerProfile('graduationYear')} />
          </div>
          <textarea className="rounded-xl border border-stone-300 px-3 py-2.5" rows={3} defaultValue={profile.bio} placeholder="Short professional bio" {...registerProfile('bio')} />
          <div><Button type="submit" disabled={profileSave.isPending}>{profileSave.isPending ? 'Saving…' : 'Save profile'}</Button></div>
        </form>
      </Card>

      <Card title="Skill stack" action={<Badge tone="teal">{data.skills?.length || 0} skills</Badge>}>
        <div className="mb-5 flex flex-wrap gap-2">
          {data.skills?.map((skill) => <Badge key={skill.id} tone={verificationTone(skill.verificationStatus)}>{skill.name} · {skill.level}</Badge>)}
        </div>
        <div className="border-t border-stone-100 pt-4"><p className="mb-3 text-sm font-semibold text-brand-950">Add a newly acquired skill</p><SkillForm onSubmit={(values) => skillAdd.mutate(values)} /></div>
      </Card>

      <Card title="Projects and achievements" action={<Badge tone="teal">{data.projects?.length || 0} projects</Badge>}>
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <form className="grid content-start gap-3 rounded-2xl bg-stone-50 p-4" onSubmit={submitProject((values) => projectSave.mutate(values))}>
            <p className="font-semibold text-brand-950">{editingProject ? 'Edit project' : 'Add project'}</p>
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Project title" {...registerProject('title', { required: true })} />
            <textarea className="rounded-xl border border-stone-300 px-3 py-2.5" rows={4} placeholder="What did you build or achieve?" {...registerProject('description', { required: true })} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Skills used, comma separated" {...registerProject('skills')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="GitHub URL (optional)" {...registerProject('githubUrl')} />
            <input className="rounded-xl border border-stone-300 px-3 py-2.5" placeholder="Live URL (optional)" {...registerProject('liveUrl')} />
            <div className="flex flex-wrap gap-2"><Button type="submit" disabled={projectSave.isPending}>{projectSave.isPending ? 'Saving…' : editingProject ? 'Save project' : 'Add project'}</Button>{editingProject ? <Button type="button" variant="outline" onClick={cancelProjectEdit}>Cancel</Button> : null}</div>
          </form>
          <div className="space-y-3">
            {data.projects?.map((project) => (
              <div key={project.id} className="rounded-2xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-brand-950">{project.title}</h2><p className="mt-1 text-sm leading-6 text-stone-600">{project.description}</p></div>{project.studentId ? <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => startProjectEdit(project)}>Edit</Button> : null}</div>
                <div className="mt-3 flex flex-wrap gap-2">{project.skills?.map((skill) => <Badge key={skill} tone="slate">{skill}</Badge>)}</div>
                <p className="mt-3 text-xs text-stone-400">Added {formatDate(project.createdAt)} · {project.status}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Documents and certifications" action={<Badge tone="slate">Evidence library</Badge>}>
        <div className="grid gap-3 md:grid-cols-2">
          {data.documents?.map((document) => <div key={document.id} className="rounded-xl border border-stone-200 p-4"><div className="flex items-start justify-between gap-3"><p className="font-medium text-brand-950">{document.fileName}</p><Badge tone={document.verificationStatus === 'User Confirmed' ? 'teal' : 'amber'}>{document.verificationStatus}</Badge></div><p className="mt-2 text-xs text-stone-500">Uploaded {formatDate(document.uploadedAt)}</p><p className="mt-2 text-sm text-stone-600">{document.extractedSkills?.join(', ') || 'No skills extracted yet'}</p></div>)}
          {!data.documents?.length ? <p className="text-sm text-stone-500">Upload certificates and evidence from the Documents section.</p> : null}
        </div>
      </Card>
    </div>
  )
}
