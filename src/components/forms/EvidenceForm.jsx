import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UploadCloud } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { EVIDENCE_FILE_ACCEPT, validateEvidenceFile } from '../../lib/evidenceFileValidation';

const evidenceTypes = ['Documento técnico', 'Relatório', 'Código-fonte', 'Imagem', 'Planilha', 'Ata de reunião', 'Publicação', 'Outro'];

const schema = z.object({
  project: z.string().min(1, 'Projeto obrigatório'),
  type: z.string().min(1, 'Tipo obrigatório'),
  title: z.string().trim().min(1, 'Título obrigatório'),
  description: z.string().trim().min(1, 'Descrição obrigatória'),
  activityRelated: z.string().optional(),
  file: z
    .any()
    .refine((files) => files?.length > 0, 'Selecione um arquivo para enviar.')
    .refine((files) => !files?.[0] || validateEvidenceFile(files[0]).code !== 'file/too-large', 'O arquivo deve ter no máximo 10 MB.')
    .refine((files) => !files?.[0] || validateEvidenceFile(files[0]).code !== 'file/invalid-format', 'Formato de arquivo não permitido.')
});

export default function EvidenceForm({
  projects = [],
  onSubmit,
  uploadLoading = false,
  savingMetadataLoading = false
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project: '',
      type: '',
      title: '',
      description: '',
      activityRelated: '',
      file: undefined
    }
  });

  const selectedFile = watch('file')?.[0];
  const submitDisabled = isSubmitting || uploadLoading || savingMetadataLoading;
  const submitLabel = uploadLoading
    ? 'Enviando arquivo...'
    : savingMetadataLoading
      ? 'Salvando metadados...'
      : isSubmitting
        ? 'Enviando evidência...'
        : 'Enviar evidência';

  async function submit(data) {
    const { file, ...payload } = data;
    try {
      await onSubmit({ ...payload, file: file[0] });
      reset();
    } catch {
      // O componente pai exibe a mensagem de erro e os dados preenchidos são preservados.
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit(submit)} aria-busy={submitDisabled}>
      <Select label="Projeto" options={projects.map((project) => ({ value: project.id, label: project.name }))} error={errors.project?.message} {...register('project')} />
      <Select label="Tipo de evidência" options={evidenceTypes} error={errors.type?.message} {...register('type')} />
      <Input label="Título" error={errors.title?.message} {...register('title')} />
      <Input label="Atividade relacionada" placeholder="Ex: Testes, Desenvolvimento" {...register('activityRelated')} />
      <Textarea className="field-full" label="Descrição" rows={4} error={errors.description?.message} {...register('description')} />
      <label className={`upload-area field-full ${errors.file ? 'upload-error' : ''}`}>
        <UploadCloud size={34} />
        <strong>{selectedFile?.name || 'Clique para selecionar um arquivo'}</strong>
        <span>O arquivo será enviado com segurança para o Supabase Storage.</span>
        <input type="file" accept={EVIDENCE_FILE_ACCEPT} {...register('file')} />
      </label>
      {errors.file && <small className="field-error field-full">{errors.file.message}</small>}
      <div className="form-actions field-full">
        <Button type="submit" disabled={submitDisabled}>{submitLabel}</Button>
      </div>
    </form>
  );
}
