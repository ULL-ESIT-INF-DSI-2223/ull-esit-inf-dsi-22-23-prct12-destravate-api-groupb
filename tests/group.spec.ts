import request from 'supertest';
import { expect } from 'chai';
import { app } from '../src/app.js';
import { GroupModel } from '../src/models/group.js';

const testGroup = {
    id: 0,
    name: "Grupo de prueba",
    members: [0, 1, 2, 3],
    global_stadistics: {
        _weekly_distance: 17,
        _weekly_deviation: 6.21,
        _monthly_distance: 50,
        _monthly_deviation: 18.18,
        _annual_distance: 172,
        _annual_deviation: 57.19
    },
    ranking: [1, 3, 2, 0],
    favorite_tracks: [1, 2],
    group_history: [{
        _id: 0,
        _date: "2021/04/14"
    },
    {
        _id: 1,
        _date: "2022/05/18"
    }]
}

const testGroup2 = {
    id: 0,
    name: "Grupo de prueba",
    members: [0, 1, 2, 3],
    global_stadistics: {
        _weekly_distance: 172,
        _weekly_deviation: 6.21,
        _monthly_distance: 50,
        _monthly_deviation: 18.18,
        _annual_distance: 172,
        _annual_deviation: 57.19
    },
    ranking: [1, 3, 2, 0],
    favorite_tracks: [1, 2],
    group_history: [{
        _id: 0,
        _date: "2021/04/14"
    },
    {
        _id: 1,
        _date: "2022/05/18"
    }]
}

beforeEach(async () => {
    await GroupModel.deleteMany();
    await new GroupModel(testGroup).save();
});

describe('POST /groups', () => {
    it('Should succesfully create a new group', async () => {
        const response = await request(app).post('/groups').send({
            id: 1,
            name: "Ciclistas Canarios",
            members: [1, 3, 7, 12],
            global_stadistics: {
                _weekly_distance: 57,
                _weekly_deviation: 5.18,
                _monthly_distance: 182,
                _monthly_deviation: 12.18,
                _annual_distance: 1428,
                _annual_deviation: 91.27
            },
            ranking: [12, 3, 1, 7],
            favorite_tracks: [6, 19],
            group_history: [{
                _id: 3,
                _date: "2023/02/28"
            },
            {
                _id: 7,
                _date: "2023/03/16"
            }]
        }).expect(201);

        const secondGroup = await GroupModel.findById(response.body._id);
        expect(secondGroup).not.to.be.null;
        expect(secondGroup!.name).to.equal("Ciclistas Canarios");
    });

    it("Should get an error", async () => {
        const response = await request(app).post('/groups').send(testGroup).expect(500);
    });
});

describe('GET /groups', () => {
    it('Should get a group by its name', async () => {
        await request(app).get('/groups?name=Grupo de prueba').expect(200);
    });

    it('Should get a group by its id', async () => {
        await request(app).get('/groups/0').expect(200);
    });

    it('Should get an error', async () => {
        await request(app).get('/groups?name="Grupo inexistente"').expect(404);
    });
});

describe('PATCH /groups', () => {
    it('Should update a group by its name', async () => {
        const response = await request(app)
          .patch(`/groups?name=Grupo de prueba`)
          .send(testGroup2);
        expect(response.status).to.be.equal(200);
      });

    it('Should update a group by its id', async () => {
    const response = await request(app)
        .patch(`/groups/0`)
        .send(testGroup);
    expect(response.status).to.be.equal(200);
    });

    it('Should get an error 404', async () => {
        const response = await request(app)
            .patch(`/groups/99`)
            .send(testGroup);
        expect(response.status).to.be.equal(404);
    });
});

describe('DELETE /groups', () => {
    it('Should find and delete a group by its name', async () => {
        await request(app).delete('/groups?name=Grupo de prueba').expect(200);
    });

    it('Should find and delete a group by its id', async () => {
        await request(app).delete('/groups/0').expect(200);
    });

    it('Should get an error 404', async () => {
        await request(app).delete('/groups/99').expect(404);
    }); 

    it('Should get an error 400', async () => {
        await request(app).delete('/groups?not_name=No es un nombre').expect(400);
    }); 
});