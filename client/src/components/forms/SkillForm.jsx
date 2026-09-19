import { useForm } from 'react-hook-form'
import Button from '../common/Button'
import { SKILL_LEVELS } from '../../utils/constants'

export default function SkillForm({ onSubmit }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', category: 'Clinical', level: 'Beginner' },
  })

  return (
    <form
      className="grid gap-3 md:grid-cols-4"
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        reset()
      })}
    >
      <input
        className="rounded-xl border border-stone-300 px-3 py-2 text-sm md:col-span-2"
        placeholder="Skill name"
        {...register('name', { required: true })}
      />
      <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" placeholder="Category" {...register('category')} />
      <select className="rounded-xl border border-stone-300 px-3 py-2 text-sm" {...register('level')}>
        {SKILL_LEVELS.map((level) => (
          <option key={level}>{level}</option>
        ))}
      </select>
      <div className="md:col-span-4">
        <Button type="submit">Add skill</Button>
      </div>
    </form>
  )
}
