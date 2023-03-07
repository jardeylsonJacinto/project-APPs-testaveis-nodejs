import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe('create appointment', () => {
  it('should be able to create an appointment', () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository)

    const startsAt = getFutureDate('2023-03-06')
    const endsAt = getFutureDate('2023-03-07')

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt,
    })).resolves.toBeInstanceOf(Appointment)
  })

  it('should not be able to create an appointment with overlapping dates', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository)

    const startsAt = getFutureDate('2023-03-06')
    const endsAt = getFutureDate('2023-03-10')

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt,
    })

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-03-13'),
      endsAt: getFutureDate('2023-03-16')
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-03-07'),
      endsAt: getFutureDate('2023-03-11')
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-03-07'),
      endsAt: getFutureDate('2023-03-15')
    })).rejects.toBeInstanceOf(Error)
  })
})