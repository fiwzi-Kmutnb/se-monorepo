import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { SaleDashboardDTO } from './dashboard.authroized.dto';
import { HTTPException } from '@se/customfilter';

@Injectable()
export class DashboardAuthroizedService {
  constructor(private readonly prismaService: PrismaService) {}

  async GetSalesAnalysisService() {
    const now = new Date();
    const Today = new Date(now);
    Today.setHours(0, 0, 0, 0);

    const months = new Date(now.getFullYear(), now.getMonth(), 1);
    const years = new Date(now.getFullYear(), 0, 1);

    const saletoday = await this.prismaService.order.aggregate({
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: Today,
          lte: now,
        },
      },
    });

    const salemonth = await this.prismaService.order.aggregate({
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: months,
          lte: now,
        },
      },
    });

    const saleyear = await this.prismaService.order.aggregate({
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: years,
          lte: now,
        },
      },
    });

    const topproducttoday = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: Today,
          lte: now,
        },
      },
      select: {
        orderlist: true,
      },
    });
    const products = [];
    topproducttoday.forEach((item) => {
      (
        item.orderlist as Array<{
          menu: string;
          quantity: number;
        }>
      ).forEach((product) => {
        const existingProduct = products.find(
          (p) => p.product === product['menu'],
        );
        if (existingProduct) {
          existingProduct.quantity += product['quantity'];
        } else {
          products.push({
            product: product['menu'],
            quantity: product['quantity'],
          });
        }
      });
    });
    const topcustomer = await this.prismaService.order.groupBy({
      by: ['customer_Lineid'],
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: Today,
          lte: now,
        },
      },
      orderBy: {
        _sum: {
          totalprice: 'desc',
        },
      },
      take: 5,
    });

    const res = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: Today,
          lte: now,
        },
      },
      include: {
        Customer: true,
      },
    });

    const topcus = topcustomer.map((item) => {
      const customer = res.find(
        (c) => c.Customer.UserID === item.customer_Lineid,
      );
      return {
        customer_name: customer ? customer.Customer.displayName : null,
        customer_Img: customer.Customer.pictureUrl
          ? customer.Customer.pictureUrl
          : null,
        totalprice: item._sum.totalprice,
        totalorder: item._count.id,
      };
    });

    return {
      statusCode: 200,
      message: 'ดึงข้อมูลการสั่งซื้อสำเร็จ',
      data: {
        thisToday: {
          date: new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          totalprice: saletoday._sum.totalprice,
          totalorder: saletoday._count.id,
          totalcustomer: saletoday._count.id,
        },
        thisMonth: {
          date: new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: '2-digit',
          }),
          totalprice: salemonth._sum.totalprice,
          totalorder: salemonth._count.id,
          totalcustomer: salemonth._count.id,
        },
        thisYear: {
          date: (new Date().getFullYear() + 543).toString(),
          totalprice: saleyear._sum.totalprice,
          totalorder: saleyear._count.id,
          totalcustomer: saleyear._count.id,
        },
        topProductToday: products.slice(0, 3).map((item) => {
          return {
            product: item.product,
            quantity: item.quantity,
          };
        }),
        topCustomertoday: topcus,
      },
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async GetSalesAnalysisRangeService(data: SaleDashboardDTO) {
    const start = new Date(data.startdate);
    const end = new Date(data.enddate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาก',
      });
    }
    if (start > end) {
      throw new HTTPException({
        message: 'วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด',
      });
    }
    end.setHours(23, 59, 59, 999);

    const TotalSales = await this.prismaService.order.aggregate({
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!TotalSales) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    const res = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        Customer: true,
      },
    });

    let trendData = [];
    if (data.groupby === 'day') {
      trendData = res.reduce((acc, item) => {
        const date = new Date(item.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        const existing = acc.find((d) => d.date === date);
        if (existing) {
          existing.totalprice += Number(item.totalprice);
          existing.orders += 1;
        } else {
          acc.push({ date, totalprice: Number(item.totalprice), orders: 1 });
        }
        return acc;
      }, []);
    } else if (data.groupby === 'month') {
      trendData = res.reduce((acc, item) => {
        const date = new Date(item.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: '2-digit',
        });
        const existing = acc.find((d) => d.date === date);
        if (existing) {
          existing.totalprice += Number(item.totalprice);
          existing.orders += 1;
        } else {
          acc.push({ date, totalprice: Number(item.totalprice), orders: 1 });
        }
        return acc;
      }, []);
    } else if (data.groupby === 'year') {
      trendData = res.reduce((acc, item) => {
        const date = new Date(item.createdAt).toLocaleDateString('th-TH', {
          year: 'numeric',
        });
        const existing = acc.find((d) => d.date === date);
        if (existing) {
          existing.totalprice += Number(item.totalprice);
          existing.orders += 1;
        } else {
          acc.push({ date, totalprice: Number(item.totalprice), orders: 1 });
        }
        return acc;
      }, []);
    }

    const topcustomer = await this.prismaService.order.groupBy({
      by: ['customer_Lineid'],
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        _sum: {
          totalprice: 'desc',
        },
      },
      take: 5,
    });
    const uniqueCustomerIds = new Set(res.map((item) => item.Customer.UserID));
    const topcus = topcustomer.map((item) => {
      const customer = res.find(
        (c) => c.Customer.UserID === item.customer_Lineid,
      );
      return {
        customer_name: customer ? customer.Customer.displayName : null,
        customer_Img: customer.Customer.pictureUrl
          ? customer.Customer.pictureUrl
          : null,
        totalprice: item._sum.totalprice,
        totalorder: item._count.id,
      };
    });

    const topseller = await this.prismaService.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        orderlist: true,
      },
    });

    const products = [];
    topseller.forEach((item) => {
      (
        item.orderlist as Array<{
          menu: string;
          quantity: number;
        }>
      ).forEach((product) => {
        const existingProduct = products.find(
          (p) => p.product === product['menu'],
        );
        if (existingProduct) {
          existingProduct.quantity += product['quantity'];
        } else {
          products.push({
            product: product['menu'],
            quantity: product['quantity'],
          });
        }
      });
    });

    return {
      statusCode: 200,
      message: 'ดึงข้อมูลการขายสำเร็จ',
      data: {
        dataRange: {
          startdate: start,
          enddate: end,
          groupby: data.groupby,
        },
        summary: {
          totalprice: TotalSales._sum.totalprice,
          totalorder: TotalSales._count.id,
          totalcustomer: uniqueCustomerIds.size,
        },
        trendData: trendData,
        topCustomer: topcus,
        topProduct: products.slice(0, 5).map((item) => {
          return {
            product: item.product,
            quantity: item.quantity,
          };
        }),
        worstPoduct: products.slice(-2).map((item) => {
          return {
            product: item.product,
            quantity: item.quantity,
          };
        }),
      },
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
