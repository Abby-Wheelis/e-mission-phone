import { LocalDt, ServerData } from './serverData';

export type UserInput = ServerData<UserInputData>;

export type UserInputData = {
  end_ts: number;
  start_ts: number;
  label: string;
  start_local_dt?: LocalDt;
  end_local_dt?: LocalDt;
  status?: string;
  match_id?: string;
};

type ConfirmedPlace = any; // TODO

export type CompositeTrip = {
  _id: { $oid: string };
  additions: any[]; // TODO
  cleaned_section_summary: any; // TODO
  cleaned_trip: { $oid: string };
  confidence_threshold: number;
  confirmed_trip: { $oid: string };
  distance: number;
  duration: number;
  end_confirmed_place: ConfirmedPlace;
  end_fmt_time: string;
  end_loc: { type: string; coordinates: number[] };
  end_local_dt: LocalDt;
  end_place: { $oid: string };
  end_ts: number;
  expectation: any; // TODO "{to_label: boolean}"
  expected_trip: { $oid: string };
  inferred_labels: any[]; // TODO
  inferred_section_summary: any; // TODO
  inferred_trip: { $oid: string };
  key: string;
  locations: any[]; // TODO
  origin_key: string;
  raw_trip: { $oid: string };
  sections: any[]; // TODO
  source: string;
  start_confirmed_place: ConfirmedPlace;
  start_fmt_time: string;
  start_loc: { type: string; coordinates: number[] };
  start_local_dt: LocalDt;
  start_place: { $oid: string };
  start_ts: number;
  user_input: UserInput;
};

export type PopulatedTrip = CompositeTrip & {
  additionsList?: any[]; // TODO
  finalInference?: any; // TODO
  geojson?: any; // TODO
  getNextEntry?: () => PopulatedTrip | ConfirmedPlace;
  userInput?: UserInput;
  verifiability?: string;
};

export type Trip = {
  end_ts: number;
  start_ts: number;
};

export type TlEntry = {
  key: string;
  origin_key: string;
  start_ts: number;
  end_ts: number;
  enter_ts: number;
  exit_ts: number;
  duration: number;
  getNextEntry?: () => PopulatedTrip | ConfirmedPlace;
};
