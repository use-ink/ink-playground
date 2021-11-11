interface Props {
  message: Message;
}

export type Message = {
  id: number;
  prompt: Prompt;
  status: Status;
  content?: string;
  severity: Severity;
};

export type Prompt = 'COMPILE' | 'SYSTEM' | 'GIST';

export type Status = 'IN_PROGRESS' | 'DONE' | 'ERROR';

export enum Severity {
  Info = 'Info',
  Success = 'Success',
  Error = 'Error',
}

export type SeverityColors = {
  Info: string;
  Success: string;
  Error: string;
};

const severityColors: SeverityColors = {
  Info: 'text-info',
  Success: 'text-success',
  Error: 'text-error',
};

export const ConsoleMessage = ({ message: m }: Props) => {
  const severity: Severity = m.severity;
  return (
    <>
      <div className="flex">
        {m.status === 'IN_PROGRESS' && (
          <i
            className={`pi pi-spinner animate-spin mr-2 pt-px text-light text-sm subpixel-antialiased ${severityColors[severity]}`}
          />
        )}
        {m.status === 'DONE' && (
          <i
            className={`pi pi-check mr-2 pt-px text-light text-sm subpixel-antialiased ${severityColors[severity]}`}
          />
        )}
        <span className={severityColors[severity]}>
          {m.prompt} [{m.id}]:
        </span>
        <span className="flex-1 typing items-center pl-2">{m?.content}</span>
      </div>
    </>
  );
};
