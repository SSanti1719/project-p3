import {emailTypes} from './index.config';

const mailTemplate = (
  title: String,
  dataTitle?: String,
  datos?: String,
  fields?: any[],
) => {
  let dataMail = ``;

  if (dataTitle && fields) {
    let templateFields = ``;

    fields.map(field => {
      templateFields += `
            <p
            style="
              color: #00b090;
              display: block;
              text-align: center;
              font-weight: 600;
              font-size: 16px;
              margin: 12px 0 0;
            "
          >
            ${field[0]}:
          </p>
          <p
            style="
              color: #414144;
              display: block;
              text-align: center;
              font-weight: 600;
              font-size: 18px;
              margin: 3px 0 0;
            "
          >
            ${field[1]}
          </p>

        `;

      return;
    });

    dataMail = `
    <div
            style="
              background-color: #fff;
              padding: 10px 8px;
              border-radius: 8px;
              width: 80%;
              min-width: 250px;
              max-width: 370px;
              margin: 25px auto 10px;
              box-sizing: border-box;
            "
          >
            <h3
              style="
                color: #b00020;
                font-size: 20px;
                text-align: center;
                margin: 0;
              "
            >
             ${datos}
            </h3>

            ${templateFields}

      </div>

    `;
  }

  return `
    <div
          style="
            width: 100%;
            margin: 25px 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            box-sizing: border-box;
          "
        >
          <div
            style="
              width: 90%;
              min-width: 300px;
              max-width: 450px;
              margin: 0 auto;
              padding: 12px;
              box-sizing: border-box;
              background-color: #b00020;
            "
          >
            <div
              style="
                width: 100%;
                border: 2px solid #fff;
                background-color: #b00020;
                box-sizing: border-box;
                padding: 8px;
                border-radius: 16px;
              "
            >
              <h1
                style="
                  text-align: center;
                  margin: 8px 0 0;
                  font-size: 32px;
                  font-weight: 700;
                  color: #fff;
                "
              >
                InMobi
              </h1>

              <h2
                style="
                  text-align: center;
                  font-size: 26px;
                  font-weight: 600;
                  color: #fff;
                  margin: 25px 0 0;
                "
              >
                ${title}
              </h2>

              ${dataMail}
            </div>
          </div>
        </div>
    `;
};

const subject = (type: string): string => {
  switch (type) {
    case emailTypes.sign_up:
      return 'Tu Usuario ha sido creado exitosamente';
    case emailTypes.change_password:
      return 'Tu Contraseña ha sido actualizada exitosamente';
    case emailTypes.reset_password:
      return 'Contraseña recuperada exitosamente';
    case emailTypes.request_create:
      return 'Tu solicitud se ha creado exitosamente';
    case emailTypes.request_update:
      return 'Tu solicitud se ha actualizado exitosamente';
    case emailTypes.client_offer:
      return 'Nueva oferta de cliente';
    case emailTypes.client_payment:
      return 'Tu pago ha sido realizado exitosamente';
    default:
      return '';
  }
};

const text = (type: string): string => {
  switch (type) {
    case emailTypes.sign_up:
      return 'Hola, tu usuario ha sido creado exitosamente con los siguientes datos';
    case emailTypes.change_password:
      return 'Hola, la contraseña de tu cuenta ha sido actualizada';
    case emailTypes.reset_password:
      return 'Hola, tu contraseña ha sido restablecida';
    case emailTypes.request_create:
      return 'Hola, tu solicitud se ha creado exitosamente';
    case emailTypes.request_update:
      return 'Hola, el estado de tu solicitud se ha actualizado';
    case emailTypes.client_offer:
      return 'Hola, un cliente ha hecho una oferta';
    case emailTypes.client_payment:
      return 'Hola, tu pago ha sido realizado exitosamente';
    default:
      return '';
  }
};
const datos = (type: string): string => {
  switch (type) {
    case emailTypes.sign_up:
      return 'Datos del usuario:';
    case emailTypes.reset_password:
      return 'Nuevos datos del usuario:';
    case emailTypes.request_create:
      return 'Datos de la solicitud: ';
    case emailTypes.request_update:
      return 'Datos de la solicitud actualizada: ';
    case emailTypes.client_offer:
      return 'Datos de la oferta';
    case emailTypes.client_payment:
      return 'Datos de la transaccion';
    default:
      return '';
  }
};
const html = (type: string, data: any): string => {
  let fields;
  switch (type) {
    case emailTypes.sign_up:
      fields = [
        ['Usuario', data.email],
        ['Contraseña', data.password],
      ];
      return mailTemplate(
        subject(emailTypes.sign_up),
        'Datos del usuario',
        datos(emailTypes.sign_up),
        fields,
      );
    case emailTypes.change_password:
      fields = [['Contraseña', data.password]];
      return mailTemplate(subject(emailTypes.change_password));
    case emailTypes.reset_password:
      fields = [
        ['Usuario', data.email],
        ['Contraseña', data.password],
      ];
      return mailTemplate(
        subject(emailTypes.reset_password),
        'Contraseña temporal',
        datos(emailTypes.reset_password),
        fields,
      );
    case emailTypes.request_create:
      fields = [
        ['Codigo', data.code],
        ['Nombre del vendedor', data.seller_name],
        ['Codigo propiedad', data.property_code],
        ['Numero propiedad', data.property_number],
        ['Valor', data.value],
        ['Oferta Inicial', data.offer],
        ['Numero de coutas', data.feeNumber],
        ['Nombre del cliente', data.client_name],
        ['Documento del cliente', data.client_document],
        ['Telefono del cliente', data.client_phone],
      ];
      return mailTemplate(
        subject(emailTypes.request_create),
        'Solicitud realizada exitosamente',
        datos(emailTypes.request_create),
        fields,
      );
    case emailTypes.request_update:
      fields = [
        ['Codigo', data.code],
        ['Codigo propiedad', data.property_code],
        ['Numero propiedad', data.property_number],
        ['El estado de su solicitud fue:', data.status],
      ];
      return mailTemplate(
        subject(emailTypes.request_update),
        'Estado de la solicitud realizada',
        datos(emailTypes.request_update),
        fields,
      );
    case emailTypes.client_offer:
      fields = [
        ['Nombre', data.name],
        ['Apellido', data.lastname],
        ['Email', data.clientEmail],
        ['Telefono', data.phone],
        ['Valor', data.value],
        ['Nombre Proyecto', data.projectName],
        ['Codigo Proyecto', data.projectCode],
        ['Bloque', data.block],
        ['Propiedad', data.property],
      ];
      return mailTemplate(
        subject(emailTypes.client_offer),
        'Nueva oferta de cliente',
        datos(emailTypes.client_offer),
        fields,
      );
    case emailTypes.client_payment:
      fields = [
        ['Valor', data.value],
        ['Codigo', data.code],
        ['Fecha', data.date],
        ['Codigo de solicitud', data.requestCode],
        ['Codigo de propiedad', data.propertyCode],
        ['Valor total', data.totalValue],
        ['Valor restante', data.remainingValue],
        ['Numero de cuotas', data.feeNumber],
        ['Valor de la cuota', data.feePayment],
      ];
      return mailTemplate(
        subject(emailTypes.client_payment),
        'Pago realizado exitosamente',
        datos(emailTypes.client_payment),
        fields,
      );
    default:
      return '';
  }
};

export {subject, text, html};
