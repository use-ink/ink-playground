import { Message } from '~/context/reducer';

interface Props {
  message: Message;
}

const severityColors = {
  Info: 'text-yellow-400',
  Success: 'text-green-400',
  Error: 'text-red-400',
};

export const ConsoleMessage = ({ message: m }: Props) => {
  return (
    <>
      <div className="flex">
        <span className={severityColors[m.severity]}>{m.prompt} &gt;</span>
        <p
          className="flex-1 typing items-center pl-2"
          dangerouslySetInnerHTML={{ __html: m?.text?.toString() }}
        />
      </div>
    </>
  );
};
