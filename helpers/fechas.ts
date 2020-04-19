export const sonFechasIguales = (fechaA:any, fechaB:any) => {
  return fechaA.getDate() == fechaB.getDate() && fechaA.getMonth() == fechaB.getMonth() && fechaA.getFullYear() == fechaB.getFullYear();
};

export const mesNumericoAMensual = (mes:any, abreviacion?:any) => {
  switch (mes) {
    case 0:
      if (abreviacion) {
        return 'Ene'
      } else {
        return 'Enero'
      }
      break;
    case 1:
      if (abreviacion) {
        return 'Feb'
      } else {
        return 'Febrero'
      }
      break;
    case 2:
      if (abreviacion) {
        return 'Mar'
      } else {
        return 'Marzo'
      }
      break;
    case 3:
      if (abreviacion) {
        return 'Abr'
      } else {
        return 'Abril'
      }
      break;
    case 4:
      if (abreviacion) {
        return 'May'
      } else {
        return 'Mayo'
      }
      break;
    case 5:
      if (abreviacion) {
        return 'Jun'
      } else {
        return 'Junio'
      }
      break;
    case 6:
      if (abreviacion) {
        return 'Jul'
      } else {
        return 'Julio'
      }
      break;
    case 7:
      if (abreviacion) {
        return 'Ago'
      } else {
        return 'Agosto'
      }
      break;
    case 8:
      if (abreviacion) {
        return 'Sep'
      } else {
        return 'Septiembre'
      }
      break;
    case 9:
      if (abreviacion) {
        return 'Oct'
      } else {
        return 'Octubre'
      }
      break;
    case 10:
      if (abreviacion) {
        return 'Nov'
      } else {
        return 'Noviembre'
      }
      break;
    case 11:
      if (abreviacion) {
        return 'Dic'
      } else {
        return 'Diciembre'
      }
      break;
    default:
      return;
      break;
  }
};