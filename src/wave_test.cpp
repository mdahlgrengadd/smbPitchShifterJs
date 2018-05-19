#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <assert.h>
#include "smbPitchShift.h"
#include <sndfile.h>
#include <samplerate.h>


#define	ARRAY_LEN(x) ((int) (sizeof (x) / sizeof ((x) [0])))
#define BUFFER_SIZE 8196

 SF_INFO sf_info, sf_info_out;
 SRC_DATA data;

void test_read_write(const char *filename, const char *copied) {
	double semitones = 1200;							// shift up by 3 semitones
	float pitchShift = pow(2., semitones/1200.);	// convert semitones to factor
	long numChannels = 1;
	long bufferLengthFrames = BUFFER_SIZE;


    SNDFILE* sndf = sf_open    (filename,  SFM_READ ,  &sf_info);
    if (sndf) {
            sf_info_out.format = sf_info.format;
            sf_info_out.samplerate = sf_info.samplerate;
            sf_info_out.channels = sf_info.channels;

        SNDFILE* outf = sf_open    (copied,  SFM_WRITE ,  &sf_info);
        if (outf) {
            float *buf , *buf2;
            int n;


            printf("filename=%s format=%d num_channels=%d sample_rate=%d sample_bits=%ld num_samples=%ld\n",
                    filename,
                    (int)sf_info.format,//wave_reader_get_format(wr),
                    sf_info.channels,//wave_reader_get_num_channels(wr),
                    sf_info.samplerate,//wave_reader_get_sample_rate(wr),
                    (long)sf_info.frames,//bytes_in_each_channel,
                    (long)sf_info.frames);//wave_reader_get_num_samples(wr));
            

            data.src_ratio = pitchShift;

            buf = ( float *)malloc(BUFFER_SIZE * (int)sf_info.channels * sizeof(float));
            buf2 = ( float *)malloc(BUFFER_SIZE * (int)sf_info.channels * sizeof(float) * data.src_ratio);

            data.data_in = buf ;
            data.data_out = buf2;

            while (0 < (n = sf_read_float   (sndf, buf, BUFFER_SIZE))) { 


            data.input_frames = n;//ARRAY_LEN (buf) ;
            data.output_frames = n*data.src_ratio;//ARRAY_LEN (buf2) ;


            if (src_simple (&data, SRC_SINC_BEST_QUALITY, 1))
            {	puts ("src_simple failed.") ;
                exit (1) ;
            };
                smbPitchShift(pitchShift, bufferLengthFrames*data.src_ratio, 4096, 16, sf_info.samplerate*data.src_ratio, buf2, buf2);
                sf_write_float   (outf, buf2, n*data.src_ratio);
            } 
            sf_close(outf);
            sf_close(sndf);
            puts("done!");
        } else {
            //printf("werror=%d\n", werror);
        }
    } else {
        //printf("rerror=%d\n", rerror);
    }
}

extern "C" int main(void) {
    test_read_write("in.wav", "out.wav");
    return 0;
}
