import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Button,
  Card,
  EmptyState,
  Field,
  Pill,
  SectionTitle,
  inputClass
} from '../../components/ui/Primitives';
import {
  ArrowLeft,
  CloudUpload,
  FileText,
  Check,
  Lock,
  Clock,
  FlaskConical
} from 'lucide-react';

interface ExamesUploadPageProps {
  onClose: () => void;
}

const CATEGORIES = [
  'Hemograma completo',
  'Vitaminas e minerais',
  'Hormônios',
  'Função hepática e renal',
  'Microbiota / parasitológico',
  'Outros'
];

/** Marcadores que a Ana observa com prioridade na leitura funcional. */
const PRIORITY_MARKERS = [
  'Vitamina D3',
  'Vitamina B12',
  'Ferritina',
  'Zinco',
  'Magnésio',
  'TSH e T4 livre',
  'PCR ultrassensível',
  'Hemograma'
];

export const ExamesUploadPage: React.FC<ExamesUploadPageProps> = ({ onClose }) => {
  const { labExams, uploadLabExam, currentUser } = useApp();

  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [examDate, setExamDate] = useState('');
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (file?: File) => {
    if (file) setFileName(file.name);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    uploadLabExam({
      user_id: currentUser?.id ?? 'usr_pacificar_01',
      file_name: fileName.trim(),
      file_url: '#',
      exam_date: examDate || new Date().toISOString().slice(0, 10),
      category,
      tags: []
    });

    setFileName('');
    setExamDate('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-7 pb-8">
      <button
        onClick={onClose}
        className="tap press -ml-2 flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-2 hover:bg-line-soft"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        Voltar
      </button>

      <header className="rise">
        <p className="eyebrow">Complemento da anamnese</p>
        <h2 className="mt-2 text-[30px] leading-[1.15]">Exames de sangue</h2>
        <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
          Se você tem exames recentes, anexe aqui. A Ana faz a leitura funcional junto com sua
          anamnese antes de montar o protocolo.
        </p>
      </header>

      {/* ── Marcadores prioritários ───────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="O que mais ajuda"
          title="Marcadores prioritários"
          hint="Se seu laudo tiver estes itens, já é o suficiente."
        />
        <ul className="flex flex-wrap gap-2">
          {PRIORITY_MARKERS.map(marker => (
            <li key={marker}>
              <Pill tone="leaf" icon={FlaskConical}>
                {marker}
              </Pill>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Envio ─────────────────────────────────────────────── */}
      <form onSubmit={submit} className="space-y-4">
        <div
          onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          className={`rounded-bloom border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? 'border-leaf-500 bg-leaf-50' : 'border-line bg-surface'
          }`}
        >
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <CloudUpload className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>

          <p className="text-[15px] font-semibold text-ink">
            {fileName || 'Arraste o arquivo aqui'}
          </p>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-[12.5px] leading-relaxed text-ink-3">
            PDF ou foto do laudo. Uma página por arquivo funciona melhor.
          </p>

          <input
            ref={inputRef}
            id="exam-file"
            type="file"
            accept=".pdf,image/*"
            className="sr-only"
            onChange={e => pickFile(e.target.files?.[0])}
          />

          <div className="mt-5">
            <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
              Escolher arquivo
            </Button>
          </div>
        </div>

        <Card className="space-y-5">
          <Field label="Nome do arquivo" required htmlFor="exam-name">
            <input
              id="exam-name"
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="Ex.: Hemograma outubro 2026"
              className={inputClass}
            />
          </Field>

          <Field label="Categoria" htmlFor="exam-category">
            <select
              id="exam-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Data da coleta"
            hint="Se não souber a data exata, deixe em branco."
            htmlFor="exam-date"
          >
            <input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Button type="submit" full size="lg" icon={CloudUpload} disabled={!fileName.trim()}>
            Anexar exame
          </Button>

          {saved && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-2 text-[13px] font-semibold text-leaf-700"
            >
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Exame anexado e enviado para a Ana
            </p>
          )}
        </Card>
      </form>

      {/* ── Anexados ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Enviados"
          title="Seus laudos"
          action={
            <span className="tnum shrink-0 pb-1 text-[12.5px] font-semibold text-ink-3">
              {labExams.length}
            </span>
          }
        />

        {labExams.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="Nenhum exame ainda"
              description="Anexar exames é opcional, mas dá à Ana uma leitura muito mais precisa do seu terreno."
            />
          </Card>
        ) : (
          <ul className="space-y-2">
            {labExams.map(exam => (
              <li key={exam.id} className="card flex items-center gap-4 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-3">
                  <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{exam.file_name}</p>
                  <p className="mt-0.5 truncate text-[12.5px] text-ink-3">
                    {exam.category} · {exam.exam_date}
                  </p>
                </div>
                <span className="shrink-0">
                  {exam.therapist_reviewed ? (
                    <Pill tone="leaf" icon={Check}>
                      Revisado
                    </Pill>
                  ) : (
                    <Pill icon={Clock}>Aguardando</Pill>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex items-start gap-3 rounded-card border border-line bg-canvas-2 px-4 py-3.5">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-[12.5px] leading-relaxed text-ink-2">
          Laudos ficam em armazenamento privado, com links assinados e expiração de 60 minutos.
          Somente você e Ana Carla Nesi têm acesso.
        </p>
      </div>
    </div>
  );
};
