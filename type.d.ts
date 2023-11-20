// midtrans-client.d.ts

declare module "midtrans-client" {
  export class Snap {
    constructor(options: SnapOptions);
    createTransaction(data: TransactionData): Promise<TransactionResult>;
    // Tambahkan deklarasi tipe lainnya sesuai kebutuhan
  }

  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
    // Tambahkan properti opsional atau wajib lainnya
  }

  interface TransactionData {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details: {
      first_name: string;
      // Tambahkan properti opsional atau wajib lainnya
    };
    // Tambahkan properti opsional atau wajib lainnya
  }

  interface TransactionResult {
    token: string;
    // Tambahkan properti lainnya sesuai respons
  }
}
