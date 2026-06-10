import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UploadCloud } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

const evidenceTypes = ['Documento técnico', 'Relatório', 'Código-fonte', 'Imagem', 'Planilha', 'Ata de reunião', 'Publicação', 'Outro'];
const maxFileSize = 10 * 1024 * 1024;

const schema = z.object({
  project: z.string().min(1, 'Projeto obrigatório'),
  type: z.string().min(1, 'Tipo obrigatório'),
  title: z.string().trim().min(1, 'Título obrigatório'),
  description: z.string().trim().min(8, 'Descrição obrigatória'),
  relatedActivity: z.string().optional(),
  file: z
    .any()
    .refine((files) => files?.length > 0, 'Selecione um arquivo para simular o envio')
    .refine((files) => !files?.[0] || files[0].size <= maxFileSize, 'Arquivo deve ter até 10 MB')
});

export default function EvidenceForm({ projects = [], onSubmit }) {
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
      relatedActivity: '',
      file: undefined
    }
  });

  const selectedFile = watch('file')?.[0];

  async function submit(data) {
    const { file, ...payload } = data;
    await onSubmit({ ...payload, fileName: file[0].name });
    reset();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit(submit)}>
      <Select label="Projeto" options={projects.map((project) => project.name)} error={errors.project?.message} {...register('project')} />
      <Select label="Tipo de evidência" options={evidenceTypes} error={errors.type?.message} {...register('type')} />
      <Input label="Título" error={errors.title?.message} {...register('title')} />
      <Input label="Atividade relacionada" placeholder="Ex: Testes, Desenvolvimento" {...register('relatedActivity')} />
      <Textarea className="field-full" label="Descrição" rows={4} error={errors.description?.message} {...register('description')} />
      <label className={`upload-area field-full ${errors.file ? 'upload-error' : ''}`}>
        <UploadCloud size={34} />
        <strong>{selectedFile?.name || 'Clique para selecionar um arquivo'}</strong>
        <span>Upload simulado. Integração futura com Firebase Storage.</span>
        <input type="file" {...register('file')} />
      </label>
      {errors.file && <small className="field-error field-full">{errors.file.message}</small>}
      <div className="form-actions field-full">
        <Button type="submit" disabled={isSubmitting}>Enviar evidência</Button>
      </div>
    </form>
  );
}
