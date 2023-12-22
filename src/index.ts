import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/calcular-tasa', (req: Request, res: Response) => {
  try {
    const { marca, importe } = req.body;

    if (!marca || !importe) {
      throw new Error('La solicitud debe incluir la marca de la tarjeta y el importe de la operación.');
    }

    const tasa = calcularTasa(marca, parseFloat(importe));

    const importeFinal = `$${(parseFloat(importe) + parseFloat(importe) * (parseFloat(tasa) / 100)).toFixed(2)}`;
    
    res.json({ tasa, importeFinal });
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

function calcularTasa(marca: string, importe: number): string {
  let tasa = 0;

  const fechaActual = new Date();

  switch (marca.toUpperCase()) {
    case 'VISA':
      const anioActualVisa = fechaActual.getFullYear() % 100;
      const mesActualVisa = fechaActual.getMonth() + 1;
      tasa = Math.max(0.3, Math.min(anioActualVisa / mesActualVisa, 5.0));
      break;

    case 'NARA':
      const diaMesActualNara = fechaActual.getDate();
      tasa = Math.max(0.3, Math.min(diaMesActualNara * 0.5, 5.0));
      break;

    case 'AMEX':
      const mesActualAmex = fechaActual.getMonth() + 1;
      tasa = Math.max(0.3, Math.min(mesActualAmex * 0.1, 5.0));
      break;

    default:
      throw new Error(`Marca de tarjeta no válida: ${marca}`);
  }

  return tasa.toFixed(2) + "%";
}