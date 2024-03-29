import request from 'supertest';
import { expect } from 'chai';
import { app } from '../src/app.js';
import { UserModel } from '../src/models/user.js';
import "mocha";

const testUser = {
    id: 0,
    name: "Usuario de prueba",
    activity: "bicicleta",
    friends: [2, 3],
    groups: [0],
    statistics: {
        _weekly_distance: 20,
        _weekly_deviation: 8,
        _monthly_distance: 100,
        _monthly_deviation: 30,
        _annual_distance: 1200,
        _annual_deviation: 100
    },
    favorite_tracks: [0, 3, 9],
    challenges: [0],
    history: [{
        _id: 0,
        _date: "2021/04/14"
    },
    {
        _id: 3,
        _date: "2022/05/18"
    }]
}

const testUser2 = {
    id: 0,
    name: "Usuario de prueba 2",
    activity: "bicicleta",
    friends: [2, 3],
    groups: [0],
    statistics: {
        _weekly_distance: 20,
        _weekly_deviation: 800,
        _monthly_distance: 100,
        _monthly_deviation: 30,
        _annual_distance: 1200,
        _annual_deviation: 100
    },
    favorite_tracks: [0, 3, 9],
    challenges: [0],
    history: [{
        _id: 0,
        _date: "2021/04/14"
    },
    {
        _id: 3,
        _date: "2022/05/18"
    }]
}

beforeEach(async () => {
    await UserModel.deleteMany();
    await new UserModel(testUser).save();
});

describe('POST /users', () => {
    it('Should succesfully create a new user', async () => {
        const response = await request(app).post('/users').send({
            id: 1,
            name: "Mortadelo",
            activity: "correr",
            friends: [0],
            groups: [1, 4],
            statistics: {
                _weekly_distance: 10,
                _weekly_deviation: 4,
                _monthly_distance: 55,
                _monthly_deviation: 17,
                _annual_distance: 675,
                _annual_deviation: 55
            },
            favorite_tracks: [1, 2, 4],
            challenges: [1],
            history: [{
                _id: 2,
                _date: "2022/11/14"
            },
            {
                _id: 4,
                _date: "2023/05/10"
            }]
        }).expect(201);

        const secondUser = await UserModel.findById(response.body._id);
        expect(secondUser).not.to.be.null;
        expect(secondUser!.name).to.equal("Mortadelo");
    });

    it("Should get an error", async () => {
        const response = await request(app).post('/users').send(testUser).expect(500);
    });
});

describe('GET /users', () => {
    it('Should get a user by its name', async () => {
        await request(app).get('/users?name=Usuario de prueba').expect(200);
    });

    it('Should get a user by its id', async () => {
        await request(app).get('/users/0').expect(200);
    });

    it('Should get an error', async () => {
        await request(app).get('/users?name="Usuario inexistente"').expect(404);
    });
});

describe('PATCH /users', () => {
    it('Should update a user by its name', async () => {
        const response = await request(app)
          .patch(`/users?name=Usuario de prueba`)
          .send(testUser2);
        expect(response.status).to.be.equal(200);
      });

    it('Should update a user by its id', async () => {
    const response = await request(app)
        .patch(`/users/0`)
        .send(testUser);
    expect(response.status).to.be.equal(200);
    });

    it('Should get an error 404', async () => {
        const response = await request(app)
            .patch(`/users/99`)
            .send(testUser);
        expect(response.status).to.be.equal(404);
    });
})

describe('DELETE /users', () => {
    it('Should find and delete a user by its name', async () => {
        await request(app).delete('/users?name=Usuario de prueba').expect(200);
    });

    it('Should find and delete a user by its id', async () => {
        await request(app).delete('/users/0').expect(200);
    });

    it('Should get an error 404', async () => {
        await request(app).delete('/users/99').expect(404);
    }); 

    it('Should get an error 400', async () => {
        await request(app).delete('/users?not_name=No es un nombre').expect(400);
    }); 
});