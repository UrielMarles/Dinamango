CREATE TABLE EJEMPLO (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL
);

INSERT INTO EJEMPLO (Nombre, Apellido)
VALUES 
('Juan', 'Pérez'),
('María', 'Gómez'),
('Carlos', 'López'),
('Ana', 'Martínez'),
('Lucía', 'Fernández');
GO

select * from ejemplo