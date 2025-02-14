import { Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IntakeFlowPageRoute } from '../App';
import { otherColors } from '../IntakeThemeProvider';
import { clockFullColor } from '../assets';
import { useGetAppointments } from '../features/appointments';
import { CustomContainer, useIntakeCommonStore } from '../features/common';
import HomepageOption from '../features/homepage/HomepageOption';
import { useZapEHRAPIClient } from '../utils';

const Homepage = (): JSX.Element => {
  const apiClient = useZapEHRAPIClient();
  const navigate = useNavigate();

  const { data: appointmentsData, isFetching } = useGetAppointments(apiClient, Boolean(apiClient));

  const activeAppointment = appointmentsData?.appointments.find((appointment) =>
    ['ready', 'pre-video', 'on-video'].includes(appointment.telemedStatus),
  );

  const isAppointmentStatusReady = Boolean(activeAppointment);

  const appointmentID = activeAppointment?.id || '';

  const handleRequestVisit = (): void => {
    navigate(`${IntakeFlowPageRoute.SelectPatient.path}?flow=requestVisit`);
  };

  const handleReturnToCall = (): void => {
    navigate(`${IntakeFlowPageRoute.WaitingRoom.path}?appointment_id=${appointmentID}`);
  };

  const handlePastVisits = (): void => {
    navigate(`${IntakeFlowPageRoute.SelectPatient.path}?flow=pastVisits`);
  };

  const handleContactSupport = (): void => {
    useIntakeCommonStore.setState({ supportDialogOpen: true });
  };

  console.log(11);

  return (
    <CustomContainer
      title="Welcome to Ottehr Telemedicine"
      description=""
      bgVariant={IntakeFlowPageRoute.Homepage.path}
      isFirstPage={true}
    >
      {isFetching ? (
        <Skeleton
          sx={{
            borderRadius: 2,
            backgroundColor: otherColors.coachingVisit,
            p: 10,
            mt: -4,
          }}
        />
      ) : (
        <>
          {isAppointmentStatusReady && (
            <HomepageOption
              title="Return to Call"
              icon={clockFullColor}
              handleClick={handleReturnToCall}
              subSlot={
                <Typography
                  variant="overline"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#FFD271',
                    color: '#A67100',
                    borderRadius: 1,
                    px: 1,
                  }}
                >
                  Active call
                </Typography>
              }
            />
          )}
          {/* {!isAppointmentStatusReady && (
            <HomepageOption title="Request Visit" icon={requestVisit} handleClick={handleRequestVisit} />
          )} */}

          <HomepageOption title="Request Visit" icon={clockFullColor} handleClick={handleRequestVisit} />

          <HomepageOption
            title="Past Visits"
            icon={clockFullColor}
            handleClick={handlePastVisits}
            subtitle="School/Work Notes and Prescriptions"
          />
        </>
      )}
      <HomepageOption title="Contact Support" icon={clockFullColor} handleClick={handleContactSupport} />
    </CustomContainer>
  );
};

export default Homepage;
