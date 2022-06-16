import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db/client';

interface Resp {
    success  : 0 | 1;
    message? : string;
    error?   : string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Resp>
) {

    try {
        
        const { name } = req.query;
        if (typeof name !== "string" || name === undefined || name.length === null) {
            res.status(400).send({
                success: 1,
                error: "Invalid query"
            })
            return
        }

        const data = await prisma.cake.findFirst({
            where : {
                name: name
            }
        })

        if (data === null) {
            res.status(404).send({
                success: 1,
                error: "Cake not found"
            })
            return
        }

        await prisma.cake.update({
            where: {
                name: name
            },
            data : {
                used: data.used + BigInt(1)
            }
        })
        
        res.status(200).send({
            success: 0,
            message: "Cake updated"
        })

    } catch (e) {
        console.log(e)
        res.status(400).send({
            success: 1,
            error: JSON.stringify(e)
        })
        return
    }

}