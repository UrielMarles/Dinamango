CREATE TABLE EJEMPLO (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL
);

INSERT INTO EJEMPLO (Nombre, Apellido)
VALUES 
('Juan', 'P�rez'),
('Mar�a', 'G�mez'),
('Carlos', 'L�pez'),
('Ana', 'Mart�nez'),
('Luc�a', 'Fern�ndez');
GO

select * from ejemplo