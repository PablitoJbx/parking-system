const mongoose = require('mongoose');

// Definir el esquema del vehículo
const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: [true, 'La placa del vehículo es obligatoria'],
    unique: true,
    uppercase: true,
    trim: true,
    validate: {
      validator: function (plate) {
        // Ejemplo de validación básica para placas (ABC123 o ABC-1234)
        return /^[A-Z]{2,3}-?\d{3,4}$/.test(plate);
      },
      message: 'Formato de placa inválido (ej: ABC123 o ABC-1234)'
    }
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['car', 'motorcycle', 'truck', 'bicycle'],
      message: 'Tipo de vehículo inválido (car|motorcycle|truck|bicycle)'
    }
  },
  entryTime: {
    type: Date,
    default: Date.now
  },
  exitTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['parked', 'exited', 'reserved'],
    default: 'parked'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Relación opcional con un modelo de usuario
  },
  parkingSlot: {
    type: String,
    required: false // Opcional si tienes espacios asignados
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Método para calcular el tiempo estacionado (virtual, no se guarda en DB)
vehicleSchema.virtual('duration').get(function () {
  if (!this.exitTime) return null;
  return (this.exitTime - this.entryTime) / (1000 * 60); // Duración en minutos
});

// Middleware para validar antes de guardar
vehicleSchema.pre('save', function (next) {
  if (this.exitTime && this.exitTime < this.entryTime) {
    throw new Error('La hora de salida no puede ser anterior a la de entrada');
  }
  next();
});

// Exportar el modelo
module.exports = mongoose.model('Vehicle', vehicleSchema);