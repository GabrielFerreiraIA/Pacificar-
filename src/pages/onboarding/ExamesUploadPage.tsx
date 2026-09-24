import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Button,
  Card,
  EmptyState,
  Field,
  Pill,
  Progress,
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
  FlaskConical,
  Eye,
  Trash2
} from 'lucide-react';
import { COTA_ARQUIVOS, LIMITE_BYTES, enviarExame, linkDoExame } from '../../lib/api/labExams';
import { formatarTamanho } from '../../lib/compressImage';
import { traduzirErroAuth } from '../../context/AuthContext';
import type { LabExamFile } from '../../types';

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

/** Tipos aceitos (iguais ao bucket "exames"). HEIC é a foto padrão do iPhone. */
const ACEITOS = '.pdf,application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif';
const TIPO_OK = /^(application\/pdf|image\/(jpeg|png|webp|heic|heif))$/i;

function mensagemDeErro(e: unknown): string {
  const msg = e instanceof Error ? e.message : '';
  if (msg === 'arquivo-grande')
    return `O arquivo passa de ${formatarTamanho(LIMITE_BYTES)}. Envie uma página por vez ou uma foto do laudo.`;
  if (/row-level security|policy/i.test(msg))
    return `Você chegou ao limite de ${COTA_ARQUIVOS} arquivos. Apague um exame antigo para enviar outro.`;
  if (/mime|invalid.*type/i.test(msg)) return 'Este tipo de arquivo não é aceito. Envie PDF ou foto (JPG, PNG, HEIC).';
  return traduzirErroAuth(msg);
}

/** Nome sugerido a partir do arquivo, sem a extensão. */
const nomeSugerido = (file: File) => file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();

export const ExamesUploadPage: React.FC<ExamesUploadPageProps> = ({ onClose }) => {
  const { labExams, uploadLabExam, addLabExam, removeLabExam, currentUser, userId } = useApp();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [examDate, setExamDate] = useState('');
  const [dragging, setDragging] = useState(false);
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [abrindo, setAbrindo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cotaCheia = labExams.length >= COTA_ARQUIVOS;
  const enviando = progresso !== null;

  const pickFile = (f?: File) => {
    setErro(null);
    setSucesso(null);
    if (!f) return;
    if (f.type && !TIPO_OK.test(f.type)) {
      setErro('Este tipo de arquivo não é aceito. Envie PDF ou foto (JPG, PNG, HEIC).');
      return;
    }
    // Foto grande tudo bem (é comprimida); PDF acima do limite não passa
    if (f.type === 'application/pdf' && f.size > LIMITE_BYTES) {
      setErro(`O PDF tem ${formatarTamanho(f.size)} e o limite é ${formatarTamanho(LIMITE_BYTES)}. Envie uma página por vez.`);
      return;
    }
    setFile(f);
    if (!fileName.trim()) setFileName(nomeSugerido(f));
  };

  const limparFormulario = () => {
    setFile(null);
    setFileName('');
    setExamDate('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !file || enviando) return;
    setErro(null);
    setSucesso(null);

    // Demonstração local (sem login): só registra na tela
    if (!userId) {
      uploadLabExam({
        user_id: currentUser?.id ?? 'usr_pacificar_01',
        file_name: fileName.trim(),
        file_url: '#',
        exam_date: examDate || new Date().toISOString().slice(0, 10),
        category,
        tags: []
      });
      limparFormulario();
      setSucesso('Exame anexado (demonstração)');
      return;
    }

    setProgresso(0);
    try {
      const r = await enviarExame(userId, { file, fileName: fileName.trim(), category, examDate }, setProgresso);
      addLabExam(r.exam);
      limparFormulario();
      const economia =
        r.tamanhoEnviado < r.tamanhoOriginal
          ? ` · otimizado de ${formatarTamanho(r.tamanhoOriginal)} para ${formatarTamanho(r.tamanhoEnviado)}`
          : '';
      setSucesso(`Exame enviado para a Ana${economia}`);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setProgresso(null);
    }
  };

  const abrir = async (exam: LabExamFile) => {
    if (!userId || exam.id.startsWith('local_')) return;
    setAbrindo(exam.id);
    // Abre a aba já no clique (Safari bloqueia pop-up aberto depois de um await)
    const aba = window.open('', '_blank');
    try {
      const url = await linkDoExame(exam.file_url);
      if (aba) aba.location.href = url;
      else window.location.href = url;
    } catch (err) {
      aba?.close();
      setErro(mensagemDeErro(err));
    } finally {
      setAbrindo(null);
    }
  };

  const apagar = async (exam: LabExamFile) => {
    if (!window.confirm(`Apagar "${exam.file_name}"? A Ana deixa de ver este laudo.`)) return;
    const ok = await removeLabExam(exam);
    if (!ok) setErro('Não foi possível apagar agora. Tente de novo em instantes.');
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
            if (!cotaCheia && !enviando) pickFile(e.dataTransfer.files?.[0]);
          }}
          className={`rounded-bloom border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? 'border-leaf-500 bg-leaf-50' : 'border-line bg-surface'
          }`}
        >
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <CloudUpload className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>

          <p className="break-words text-[15px] font-semibold text-ink">
            {file ? file.name : cotaCheia ? 'Limite de arquivos atingido' : 'Arraste o arquivo aqui'}
          </p>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-[12.5px] leading-relaxed text-ink-3">
            {file
              ? `${formatarTamanho(file.size)}${file.type.startsWith('image/') ? ' · a foto é otimizada antes do envio' : ''}`
              : cotaCheia
                ? `Você já tem ${COTA_ARQUIVOS} arquivos. Apague um antigo para enviar outro.`
                : 'PDF ou foto do laudo. Uma página por arquivo funciona melhor.'}
          </p>

          <input
            ref={inputRef}
            id="exam-file"
            type="file"
            accept={ACEITOS}
            className="sr-only"
            onChange={e => pickFile(e.target.files?.[0])}
          />

          <div className="mt-5">
            <Button
              type="button"
              variant="secondary"
              disabled={cotaCheia || enviando}
              onClick={() => inputRef.current?.click()}
            >
              {file ? 'Trocar arquivo' : 'Escolher arquivo'}
            </Button>
          </div>
        </div>

        <Card className="space-y-5">
          <Field label="Nome do exame" required htmlFor="exam-name">
            <input
              id="exam-name"
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="Ex.: Hemograma outubro 2026"
              maxLength={120}
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

          {enviando && (
            <div className="space-y-2" aria-live="polite">
              <Progress value={(progresso ?? 0) * 100} label="Enviando exame" />
              <p className="text-center text-[12.5px] text-ink-3">
                Enviando… <span className="tnum">{Math.round((progresso ?? 0) * 100)}%</span>
              </p>
            </div>
          )}

          <Button
            type="submit"
            full
            size="lg"
            icon={CloudUpload}
            loading={enviando}
            disabled={!fileName.trim() || !file || cotaCheia}
          >
            {enviando ? 'Enviando' : 'Anexar exame'}
          </Button>

          {erro && (
            <p
              role="alert"
              className="rounded-field border border-clay-100 bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-clay-600"
            >
              {erro}
            </p>
          )}

          {sucesso && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-2 text-center text-[13px] font-semibold text-leaf-700"
            >
              <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              {sucesso}
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
              {labExams.length} de {COTA_ARQUIVOS}
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
            {labExams.map(exam => {
              const real = !!userId && !exam.id.startsWith('local_');
              return (
                <li key={exam.id} className="card flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-3">
                    <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{exam.file_name}</p>
                    <p className="mt-0.5 truncate text-[12.5px] text-ink-3">
                      {exam.category}
                      {exam.exam_date && ` · ${exam.exam_date.split('-').reverse().join('/')}`}
                    </p>
                    <span className="mt-1.5 inline-block">
                      {exam.therapist_reviewed ? (
                        <Pill tone="leaf" icon={Check}>
                          Revisado
                        </Pill>
                      ) : (
                        <Pill icon={Clock}>Aguardando</Pill>
                      )}
                    </span>
                  </div>
                  {real && (
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        icon={Eye}
                        loading={abrindo === exam.id}
                        onClick={() => void abrir(exam)}
                        aria-label={`Ver ${exam.file_name}`}
                      >
                        Ver
                      </Button>
                      <button
                        onClick={() => void apagar(exam)}
                        aria-label={`Apagar ${exam.file_name}`}
                        className="tap flex h-10 w-10 items-center justify-center rounded-full text-ink-3 hover:bg-clay-50 hover:text-clay-600"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
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
