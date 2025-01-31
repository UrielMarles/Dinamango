"use client";

import { useState } from "react";
import styles from './iniciarSesion.module.css';

export default function IniciarSesion() {
    const [inputFocus, setInputFocus] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        mail: "",
        passwd: "",
    });

    const handleFocus = (field: string) => {
        setInputFocus(field);
    };

    const handleBlur = (field: string) => {
        if (!formData[field as keyof typeof formData]) {
            setInputFocus(null);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    return (
        <form className={styles.form}>
            <legend>Iniciar Sesión</legend>

            {/* Mail */}
            <fieldset className={styles.fieldset}>
                {inputFocus === "mail" || formData.mail ? (
                    <legend>Mail</legend>
                ) : (
                    <label htmlFor="mail">Mail: </label>
                )}
                <input
                    type="text"
                    id="mail"
                    value={formData.mail}
                    onFocus={() => handleFocus("mail")}
                    onBlur={() => handleBlur("mail")}
                    onChange={handleChange}
                />
            </fieldset>

            {/* Contraseña */}
            <fieldset className={styles.fieldset}>
                {inputFocus === "passwd" || formData.passwd ? (
                    <legend>Contraseña</legend>
                ) : (
                    <label htmlFor="passwd">Contraseña: </label>
                )}
                <input
                    type="password"
                    id="passwd"
                    value={formData.passwd}
                    onFocus={() => handleFocus("passwd")}
                    onBlur={() => handleBlur("passwd")}
                    onChange={handleChange}
                />
            </fieldset>
        </form>
    );
}