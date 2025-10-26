export interface MensajeRespuesta {
    Id: number;
    ChatId: number;
    RemitenteId: number;
    Contenido: string;
    FechaEnvio: Date;
    Leido: boolean;
}