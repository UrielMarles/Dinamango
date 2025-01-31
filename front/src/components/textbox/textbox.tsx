import style from './textBox.module.css';

interface TextBoxProps {
    label: string;
    id: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextBox({ label, id, value, onChange }: TextBoxProps) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input type="text" id={id} value={value} onChange={onChange}/>
        </div>
    );
}

