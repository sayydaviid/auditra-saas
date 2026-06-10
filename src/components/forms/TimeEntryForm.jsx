import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

const activityTypes = ['Pesquisa', 'Desenvolvimento', 'Testes', 'Documentação', 'Reunião técnica', 'Validação', 'Revisão', 'Outro'];

const schema = z.object({
  project: z.string().min(1, 'Projeto obrigatório'),
  date: z.string().min(1, 'Data obrigatória'),
  hours: z.preprocess(
    (value) => (value === '' || value === null ? undefined : Number(value)),
    z
      .number({ required_error: 'Horas obrigatórias', invalid_type_error: 'Horas obrigatórias' })
      .min(0.25, 'Informe pelo menos 0,25 hora')
      .max(24, 'Informe no máximo 24 horas por dia')
  ),
  activityType: z.string().min(1, 'Tipo de atividade obrigatório'),
  description: z.string().min(8, 'Descrição obrigatória'),
  deliverable: z.string().optional(),
  observations: z.string().optional()
});

export default function TimeEntryForm({ projects = [], onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project: '',
      date: new Date().toISOString().slice(0, 10),
      hours: '',
      activityType: '',
      description: '',
      deliverable: '',
      observations: ''
    }
  });

  async function submit(data) {
    await onSubmit(data);
    reset({
      project: '',
      date: new Date().toISOString().slice(0, 10),
      hours: '',
      activityType: '',
      description: '',
      deliverable: '',
      observations: ''
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit(submit)}>
      <Select
        label="Projeto"
        options={projects.map((project) => project.name)}
        error={errors.project?.message}
        {...register('project')}
      />
      <Input label="Data" type="date" error={errors.date?.message} {...register('date')} />
      <Input label="Quantidade de horas" type="number" min="0.25" max="24" step="0.25" error={errors.hours?.message} {...register('hours')} />
      <Select label="Tipo de atividade" options={activityTypes} error={errors.activityType?.message} {...register('activityType')} />
      <Textarea className="field-full" label="Descrição da atividade" rows={4} error={errors.description?.message} {...register('description')} />
      <Input label="Entregável relacionado" placeholder="Ex: Relatório técnico mensal" {...register('deliverable')} />
      <Input label="Observações" placeholder="Informações adicionais" {...register('observations')} />
      <div className="form-actions field-full">
        <Button type="submit" disabled={isSubmitting}>Adicionar registro</Button>
      </div>
    </form>
  );
}
