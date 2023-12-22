// src/index.ts
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/calcular-tasa', (req: Request, res: Response) => {
  try {
    const { marca, monto } = req.body;

    if (!marca || !monto) {
      throw new Error('La solicitud debe incluir la marca de la tarjeta y el monto de la operación.');
    }

    const tasa = calcularTasa(marca, parseFloat(monto));

    res.json({ tasa });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

function calcularTasa(marca: string, monto: number): number {
  let tasa = 0;

  switch (marca.toUpperCase()) {
    case 'VISA':
      tasa = monto * 0.02;
      break;
    case 'NARA':
      tasa = monto * 0.015;
      break;
    case 'AMEX':
      tasa = monto * 0.03;
      break;
    default:
      throw new Error('Marca de tarjeta no válida. Las opciones son: VISA, NARA, AMEX.');
  }

  return tasa;
}
