### COMANDOS BASICOS DO POSTGRES

criar tabela: com id gerado automatico como chave primaria

    DROP TABLE IF EXISTS TB_HEROIS;
    CREATE TABLE TB_HEROIS(
        ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
        NOME TEXT NOT NULL,
        PODER TEXT NOT NULL
        )

cread item

    INSERT INTO TB_HEROIS(NOME, PODER)
    VALUES  ('Hulk', 'forca'),
            ('Chapolin', 'marreta biônica'),
            ('Bruce lee', 'agilidade')

read item

    SELECT * FROM TB_HEROIS
    SELECT * FROM TB_HEROIS WHERE PODER = 'agilidade'
    SELECT id FROM TB_HEROIS WHERE PODER = 'forca'

update item

    UPDATE TB_HEROIS 
    SET PODER = 'força e raiva'
    WHERE ID = '1'

delete item

    DELETE FROM TB_HEROIS WHERE ID = '2'

delete tabela

    DROP TABLE TB_HEROIS