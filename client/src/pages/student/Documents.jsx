import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import FileUpload from '../../components/forms/FileUpload'
import { studentApi } from '../../api/studentApi'
import { useFileUpload } from '../../hooks/useFileUpload'
import { formatDate } from '../../utils/formatters'
import { useNotify } from '../../context/NotificationContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

export default function Documents() {
  const { data = [], isLoading } = useQuery({ queryKey: ['documents'], queryFn: studentApi.documents })
  const { upload, uploading } = useFileUpload()
  const qc = useQueryClient()
  const notify = useNotify()
  const confirm = useMutation({
    mutationFn: studentApi.confirmDocument,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      notify.push({ type: 'success', title: 'Skills confirmed into your twin' })
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-4xl text-brand-950">Documents</h1>
      <FileUpload
        uploading={uploading}
        onFile={async (file) => {
          await upload(file)
          qc.invalidateQueries({ queryKey: ['documents'] })
          notify.push({ type: 'success', title: 'Demo OCR complete', message: 'Review extracted skills.' })
        }}
      />
      {data.map((doc) => (
        <Card key={doc.id} title={doc.fileName} action={<Badge>{doc.verificationStatus}</Badge>}>
          <p className="text-sm text-stone-600">{doc.extractedText}</p>
          <p className="mt-2 text-xs text-stone-400">Uploaded {formatDate(doc.uploadedAt)} · {doc.extractedOrg}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {doc.extractedSkills?.map((s) => (
              <Badge key={s} tone="amber">{s}</Badge>
            ))}
          </div>
          {doc.verificationStatus === 'AI Extracted' ? (
            <Button className="mt-4" onClick={() => confirm.mutate(doc.id)}>
              Confirm extracted skills
            </Button>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
